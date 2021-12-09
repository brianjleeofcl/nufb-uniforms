import fetch from 'node-fetch';
import { join }from 'path';
import { writeFile } from 'fs';
import { unparse } from 'papaparse';
import { snakeCase } from 'change-case';
import { flattenNested, getYears } from './utils';
import { dataKeys, ESPNDetailResult, ESPNSummaryResult, FullGameData, SeasonBulkData, TeamResult } from "./data_types";

const APIURL = (year: number) => `https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/77/schedule?season=${year}`;
const PSURL = (year: number) =>`${APIURL(year)}&seasontype=3`;
const DTURL = (id: string) => `https://site.api.espn.com/apis/site/v2/sports/football/college-football/summary?event=${id}`
const teamURL = (id: string) => `https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/${id}`
const targetYears = getYears();

function findNU<T extends { team: {location: string } }>(teams: T[]): T[] {
  const [teamA, teamB] = teams;
  return teamA.team.location === 'Northwestern' ? [teamA, teamB] : [teamB, teamA];
}

(function main() {
  const requests = [...targetYears.map(year => fetch(APIURL(year))), ...targetYears.map(year => fetch(PSURL(year)))];
  const parsedResponses = requests.map(req => {
    return req.then(res => res.json() as Promise<ESPNSummaryResult>)
      .then(data => data.events.map(game => {
        const gameData = game.competitions[0];
        const [nu, op] = findNU(gameData.competitors);

        const flat: SeasonBulkData = {
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
          attendance: gameData.attendance,
          broadcast: gameData.broadcasts[0]?.media.shortName,
          regularSeason: data.requestedSeason.type === 2,
        };

        if (flat.final) {
          flat.score = nu.score.value;
          flat.opponentScore = op.score.value;
          flat.win = nu.winner;

          const nuTotalRec = nu.record.find(rec => rec.type === 'total');
          const [nuWin, nuLoss] = nuTotalRec ? nuTotalRec.displayValue.split('-') : [];
          const opTotalRec = op.record.find(rec => rec.type === 'total')
          const [opWin, opLoss] = opTotalRec ? opTotalRec.displayValue.split('-') : [];
          flat.seasonWins = +nuWin;
          flat.seasonLosses = +nuLoss;
          flat.opponentSeasonWins = +opWin;
          flat.opponentSeasonLosses = +opLoss;
        }

        if (nu.curatedRank.current <= 25) {
          flat.ranking = nu.curatedRank.current;
        }

        if (op.curatedRank.current <= 25) {
          flat.opponentRanking = op.curatedRank.current;
        }

        return flat;
      }));
    });

  Promise.all(parsedResponses)
    .then(nested => flattenNested(nested))
    .then(flattened => Promise.all(flattened.map(data => {
      return data.final
        ? fetch(DTURL(data.gameESPNID))
          .then(res => res.json() as Promise<ESPNDetailResult>)
          .then(detail => {
            const [nu, op] = findNU(detail.header.competitions[0].competitors);
            const [nuBox, opBox] = findNU(detail.boxscore.teams);

            const res: FullGameData = {
              ...data,
              score1Q: +nu.linescores[0].displayValue,
              score2Q: +nu.linescores[1].displayValue,
              score3Q: +nu.linescores[2].displayValue,
              score4Q: +nu.linescores[3].displayValue,
              opponentScore1Q: +op.linescores[0].displayValue,
              opponentScore2Q: +op.linescores[1].displayValue,
              opponentScore3Q: +op.linescores[2].displayValue,
              opponentScore4Q: +op.linescores[3].displayValue,
              grassField: detail.gameInfo.venue?.grass,
              overtime: nu.linescores.length - 4,
              attendance: detail.gameInfo.attendance,
              capacity: detail.gameInfo.venue?.capacity,
              bettingLine: detail.pickcenter[0].details,
              stats: JSON.stringify(nuBox.statistics),
              opponentStats: JSON.stringify(opBox.statistics),
              title: detail.header.gameNote,
            }
            if (res.overtime) {
              const nuOT = nu.linescores.slice(4);
              const opOT = op.linescores.slice(4);
              res.scoreOT = nuOT.reduce((agg, { displayValue }) => agg + +displayValue, 0)
              res.opponentScoreOT = opOT.reduce((agg, { displayValue }) => agg + +displayValue, 0)
            }
            return res;
          })
        : fetch(teamURL(data.opponentESPNID))
          .then(res => res.json() as Promise<TeamResult>)
          .then(team => {
            const [opWin, opLoss] = team.team.record.items[0].summary.split('-');
            const res: Partial<FullGameData> = {
              ...data,
              opponentSeasonWins: +opWin,
              opponentSeasonLosses: +opLoss,
            };
            return res;
          })
    })))
    .then((flatData: Partial<FullGameData|SeasonBulkData>[]) => {
      const keys = dataKeys;
      const data: any[][] = flatData.map(game => keys.map(key => game[key]));
      const fields = keys.map(key => snakeCase(key));
      return unparse({ fields, data })
    })
    .then(csv => {
      const name = process.argv[2] || `data_${Date.now()}.csv`
      const path = join(process.cwd(),'output', name)
      writeFile(path, csv, (err) => {
        if (!err) {
          console.log(`File written: ${name}, exiting`)
          process.exit(0)
        } else {
          console.error(`Error writing file!`);
          throw err;
        }
      });
    })
    .catch(err => console.error(err));
})();
