#! /usr/bin/env node

const https = require('https');
const { StringDecoder } = require('string_decoder');
const { createInterface } = require('readline');

const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const season = process.argv[2];
const root = process.env["ROOT"];
const rsUrl = `https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/77/schedule?season=${season}`;
const psUrl = `${rsUrl}&seasontype=3`;

Promise.all([
  getData(rsUrl).then(data => {
    return data.events.map(game => formatData(data, game));
  }),
  getData(psUrl).then(data => {
    return data.events.map(game => formatData(data, game));
  }),
])
  .then(([reg, ps]) => sendData([...reg, ...ps]));

function getData(url) {
  console.log('Fetching data');
  console.log(url);
  const parser = new StringDecoder('utf8');
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

function formatData(data, game) {
  const gameData = game.competitions[0];
  const [nu, op] = findNU(gameData.competitors);

  const res = {
    final: gameData.status.type.completed,
    canceled: gameData.status.type.name === 'STATUS_CANCELED',
    gameESPNID: game.id,
    gameDate: game.date,
    season: game.season.year,
    canonicalWeek: game.week.number,
    opponent: op.team.location,
    opponentMascot: op.team.shortDisplayName,
    opponentAbbrev: op.team.abbreviation,
    opponentESPNID: op.team.id,
    home: nu.homeAway === 'home',
    stadium: gameData.venue?.fullName,
    city: `${gameData.venue?.address.city}, ${gameData.venue?.address.state}`,
    zip: gameData.venue?.address.zipCode,
    regularSeason: data.season.type === 2,
  };
  return res;
}

function sendData(data) {
  console.log(data);
  readline.question(`send?[y/N]`, resp => {
    if (resp.toLowerCase() !== 'y') return console.log('canceled');

    console.log('sending data')
    const result = JSON.stringify(data);
    const user = process.env["USER"];
    const password = process.env["PASSWORD"];
    const url = `${root}/api/game-table/season`;
    const req = https.request(url, {
      method: 'PATCH',
      auth: `${user}:${password}`,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': result.length,
      },
    }, res => {
      if (res.statusCode !== 200) return console.error(res.statusCode, res.statusMessage)
      const count = res.headers['X-Rows-Affected'];
      console.log(`post success, ${count} rows updated`);
      process.exit(0);
    });
    req.on('error', err => { throw err });
    req.write(result);
    req.end();
  })
}
