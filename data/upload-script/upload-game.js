#! /usr/bin/env node

const https = require('https');
const { StringDecoder } = require('string_decoder');
const { createInterface } = require('readline');

function exitWithError(err) {
  console.error(err);
  process.exit(1);
}

function exitGracefully(msg) {
  console.log(msg);
  process.exit(0);
}

const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
});

let season, week;
try {
  [season, week] = process.argv[2].split('/');
  if (!season || !week) throw new Error();
} catch {
  exitWithError(new Error("Missing or malformed argument"))
}
const root = process.env["HOST"];
const idUrl = `https://${root}/api/game/${season}/${week}/id`;
const parser = new StringDecoder('utf8');

try {
  const req = https.request(idUrl, res => {
    let json = '';
    res.on('data', data => json += parser.write(data));
    res.on('end', () => {
      parser.end();
      const { gameID, gameESPNID } = JSON.parse(json);
      console.log(gameID, gameESPNID);
      getData(gameESPNID)
        .then(data => formatData(data))
        .then(formatted => sendData(gameID, formatted))
        .catch(err => exitWithError(err))
    });
  });
  req.on('error', err => { throw err });
  req.end();
} catch(err) {
  exitWithError(err)
}

function getData(id) {
  const url = `https://site.api.espn.com/apis/site/v2/sports/football/college-football/summary?event=${id}`
  console.log('Fetching data');
  console.log(url);
  return new Promise((rev, rej) => {
    const req = https.request(url, res => {
      let json = '';
      res.on('data', chunk => json += parser.write(chunk));
      res.on('end', () => {
        parser.end();
        rev(JSON.parse(json));
      });
      res.on('error', err => rej(err));
    });
    req.end();
  });
}

function findNU(teams) {
  const [teamA, teamB] = teams;
  return teamA.team.location === 'Northwestern' ? [teamA, teamB] : [teamB, teamA];
}

function formatData(data) {
  console.log('received data, formatting...');
  const { boxscore, gameInfo, header, pickcenter } = data;
  const [nu, op] = findNU(header.competitions[0].competitors);
  const [nuBox, opBox] = findNU(boxscore.teams);
  const nuTotalRec = nu.record.find(rec => rec.type === 'total');
  const [nuWin, nuLoss] = nuTotalRec ? nuTotalRec.displayValue.split('-') : [];
  const opTotalRec = op.record.find(rec => rec.type === 'total');
  const [opWin, opLoss] = opTotalRec ? opTotalRec.displayValue.split('-') : [];

  const city = gameInfo.venue.address.state
    ? `${gameInfo.venue.address.city}, ${gameInfo.venue.address.state}`
    : gameInfo.venue.address.city;

  const res = {
    final: header.competitions[0].status.type.completed,
    grassField: gameInfo.venue?.grass,
    capacity: gameInfo.venue?.capacity,
    bettingLine: pickcenter[0].details,
    title: header.gameNote,
    gameDate: header.competitions[0].date,
    home: nu.homeAway === 'home',
    stadium: gameInfo.venue.fullName,
    city,
    zip: gameInfo.venue.address.zipCode,
    ranking: nu.rank,
    opponentRanking: op.rank,
    seasonWins: +nuWin,
    seasonLosses: +nuLoss,
    opponentSeasonWins: +opWin,
    opponentSeasonLosses: +opLoss,
    broadcast: header.competitions[0].broadcasts[0]?.media.shortName,
  };
  if (res.final) {
    res.attendance = gameInfo.attendance;
    res.score = +nu.score;
    res.opponentScore = +op.score;
    res.overtime = nu.linescores.length - 4;
    res.win = nu.winner;
    res.score1Q = +nu.linescores[0].displayValue;
    res.score2Q = +nu.linescores[1].displayValue;
    res.score3Q = +nu.linescores[2].displayValue;
    res.score4Q = +nu.linescores[3].displayValue;
    res.opponentScore1Q = +op.linescores[0].displayValue;
    res.opponentScore2Q = +op.linescores[1].displayValue;
    res.opponentScore3Q = +op.linescores[2].displayValue;
    res.opponentScore4Q = +op.linescores[3].displayValue;
    res.stats = JSON.stringify(nuBox.statistics);
    res.opponentStats = JSON.stringify(opBox.statistics);
  }

  if (res.overtime) {
    const nuOT = nu.linescores.slice(4);
    const opOT = op.linescores.slice(4);
    res.scoreOT = nuOT.reduce((agg, { displayValue }) => agg + +displayValue, 0);
    res.opponentScoreOT = opOT.reduce((agg, { displayValue }) => agg + +displayValue, 0);
  }

  if (!res.broadcast) {
    return fillInDataGaps(res)
  }

  return res
}

function fillInDataGaps(data) {
  return new Promise((resolve) => {
    readline.question('broadcast? (all caps)', resp => {
      if (resp.length) {
        data.broadcast = resp;
      }
      resolve(data)
    });
  });
}

function sendData(id, data) {
  console.log(data);
  readline.question('send?[y/N]', resp => {
    if (resp.toLowerCase() !== 'y') return exitGracefully("Canceled")
    sendRequest(id, data);
  });
}

function sendRequest(id, data) {
  console.log('sending data')
  const result = JSON.stringify(data);
  const user = process.env["UPLOAD_USERNAME"];
  const password = process.env["UPLOAD_PASSWORD"];
  const url = `https://${root}/api/game-table/id/${id}`;
  const req = https.request(url, {
      method: 'PATCH',
      auth: `${user}:${password}`,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': result.length,
      },
    }, res => {
      if (res.statusCode !== 200) throw new Error(res.statusCode, res.statusMessage);
      const count = res.headers['X-Rows-Affected'];
      exitGracefully(`post success, ${count} rows updated`);
    });
  req.on('error', err => { throw err });
  req.write(result);
  req.end();
}
