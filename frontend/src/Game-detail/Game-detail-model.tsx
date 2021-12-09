import { format } from "date-fns";
import { format as tzFormat, utcToZonedTime } from "date-fns-tz";
import { Box, Heading, Table, TableBody, TableCell, TableHeader, TableRow, Text } from "grommet";
import { ReactElement } from "react";
import { GameFullRawData, GameSummary, Team, UniformDetail } from "../Models";
import { GameScore } from "./Game-score";

export function newGameDetail(raw: GameFullRawData): GameDetail {
  return raw.final ? new FinalGameDetail(raw) : new UpcomingGameDetail(raw);
}

export abstract class GameDetail extends GameSummary {
  officialTweet: string;
  stadium: string;
  city: string;
  capacity: number;
  longDate: string;
  ctKickoff: string;
  bettingLine?: string;
  broadcast: string;
  uniform: UniformDetail;
  uniformAppearance: string;
  uniformCurrentTotal: number;
  uniformLosses: number;
  uniformWinPercent: string;
  uniformWins: number;
  constructor(raw: GameFullRawData) {
    super(raw);
    this.officialTweet = raw.tweetUrl as string;
    this.stadium =  raw.stadium;
    this.city = raw.city;
    this.capacity = raw.capacity;
    this.bettingLine = raw.bettingLine;
    this.broadcast = raw.broadcast;
    this.uniform = new UniformDetail(
      raw.helmetColor, raw.helmetDetail,
      raw.jerseyColor, raw.jerseyLetterColor, raw.jerseyStripeDetail,
      raw.pantsColor, raw.pantsDetail, raw.special,
    );
    this.uniformAppearance = raw.uniformAppearance;
    this.uniformCurrentTotal = raw.uniformCurrentTotal;
    this.uniformWins = raw.uniformWins;
    this.uniformLosses = raw.uniformLosses;
    this.uniformWinPercent = raw.uniformWinPercent;
    this.longDate = format(this.date, 'iii, MMM do, Y')
    const zonedTime = utcToZonedTime(this.date, 'America/Chicago');
    this.ctKickoff = tzFormat(zonedTime, 'p',{ timeZone: 'America/Chicago'})
  }

  abstract detailComponent(size: string): ReactElement
}

export class UpcomingGameDetail extends GameDetail {
  final = false;

  detailComponent(size: string) {
    return <Box direction="column" align="end">
      <Heading level="4" alignSelf="end">{this.longDate} {this.kickoff}</Heading>
      {this.ctKickoff !== this.kickoff && <Text>{this.ctKickoff}(c)</Text>}
      <Text>{this.stadium} — {this.city}</Text>
      {this.capacity && <Text>Capacity: {this.capacity}</Text>}
    </Box>
  }
}

type ScoreboardRow = [number, number, number, number, number?];

export interface ScoreByQuarter {
  score: { team: Team, quarters: ScoreboardRow, final: number }[]
  home: boolean;
  win: boolean;
}

export class FinalGameDetail extends GameDetail {
  final = true;
  win: boolean;
  scoreByQuarter: ScoreByQuarter;
  attendance?: number;
  statsTable: string[][];

  constructor(raw: GameFullRawData) {
    super(raw);
    this.win = raw.win as boolean;
    const scores: ScoreboardRow = [
      raw.score1Q as number,
      raw.score2Q as number,
      raw.score3Q as number,
      raw.score4Q as number,
    ];
    const opponentScores: ScoreboardRow = [
      raw.opponentScore1Q as number,
      raw.opponentScore2Q as number,
      raw.opponentScore3Q as number,
      raw.opponentScore4Q as number,
    ];
    if (raw.overtime) {
      scores.push(raw.scoreOT as number);
      opponentScores.push(raw.opponentScoreOT as number);
    }
    const game = { win: this.win, home: this.home };
    const team = { team: this.NU, final: raw.score as number, quarters: scores };
    const opponent = { team: this.opponent, final: raw.opponentScore as number, quarters: opponentScores };
    this.scoreByQuarter = this.home ? {
      ...game,
      score: [opponent, team],
    } : {
      ...game,
      score: [team, opponent],
    };
    this.attendance = raw.attendance;

    const statA = this.home ? raw.opponentStats : raw.stats;
    const statB = this.home ? raw.stats : raw.opponentStats;
    const table = this.home
      ? [['', this.opponent.abbrev, this.NU.abbrev]]
      : [['', this.NU.abbrev, this.opponent.abbrev]];
    const ordered = statA.length === statB.length &&
      statA.every((stat, i) => stat.name === statB[i].name);
    this.statsTable = statA.reduce((acc, stat, i) => {
      acc.push([stat.label, stat.displayValue, statB[i].displayValue]);
      return acc;
    }, table)
    if (ordered) {
    } else {
      this.statsTable = []
    }
  }

  detailComponent(size: string) {
    return <Box direction="column" align="end" basis={size === 'small' ? '100%' : '500px'}>
      <Heading level="4">{this.longDate} {this.kickoff}</Heading>
      {this.ctKickoff !== this.kickoff && <Text>{this.ctKickoff}(c)</Text>}
      <Text>{this.stadium} — {this.city}</Text>
      {this.capacity && this.attendance
        && <Text>Attendance: {this.attendance} / Capacity: {this.capacity}</Text>}
      <Text>TV: {this.broadcast}</Text>
      <GameScore {...this.scoreByQuarter} />
      <Table width="100%">
        <TableHeader>
          <TableRow>{this.statsTable[0].map(v => <TableCell key={v||'head'}>{v}</TableCell>)}</TableRow>
        </TableHeader>
        <TableBody>
          {this.statsTable.slice(1).map((row, i) =>
            <TableRow key={i}>
              {row.map((v, i) => <TableCell key={i} align="right">{v}</TableCell>)}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  }
};
