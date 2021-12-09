import { format, parseJSON } from "date-fns";
import { NU, SimpleNU, SimpleTeam, Team, TeamData } from "./Team";
import { getColor, UniformColors, UniformDetailResult } from "./Uniform";

export interface Scoreboard {
  host: Team;
  visitor: Team;
  result: { home: boolean, win: boolean, homeScore: number, awayScore: number };
}

export interface GameSummaryRawData {
  fullOrder: number;
  season: number;
  week: number;
  title?: string;
  gameDate: string;
  opponent: string;
  opponentAbbrev: string;
  opponentMascot: string;
  final: boolean;
  win?: boolean;
  score?: number;
  opponentScore?: number;
  seasonWins: number;
  seasonLosses: number;
  opponentSeasonWins: number;
  opponentSeasonLosses: number;
  home: boolean;
  helmetColor: string;
  jerseyColor: string;
  pantsColor: string;
  ranking?: number;
  opponentRanking?: number;
  opponentESPNID: string; // fixme
  broadcast: string;
  overtime: number;
  seasonLength?: number;
}

export function newGameSummary(raw: GameSummaryRawData): GameSummary {
  return raw.final ? new FinalGameSummary(raw) : new UpcomingGameSummary(raw);
}

export abstract class GameSummary {
  index: number;
  season: number;
  lastOfSeason: boolean;
  week: number;
  date: Date;
  dateString: string;
  kickoff: string;
  title: string;
  titleWithYear: string;
  NU: NU;
  opponent: Team;
  abstract final: boolean;
  home: boolean;
  uniform: UniformColors;
  overtime: number;

  constructor(raw: GameSummaryRawData) {
    this.index = raw.fullOrder;
    this.season = raw.season;
    this.lastOfSeason = raw.week === raw.seasonLength;
    this.week = raw.week;
    this.title = raw.title || `Week ${raw.week}`;
    this.titleWithYear = raw.title || `${raw.season} ${this.title}`
    this.date = parseJSON(raw.gameDate);
    this.dateString = format(this.date, 'M/d');
    this.kickoff = format(this.date, 'p');
    this.home = raw.home;
    this.NU = new NU({ wins: raw.seasonWins, losses: raw.seasonLosses, ranking: raw.ranking });
    const opponentData: TeamData = {
      name: raw.opponent,
      abbrev: raw.opponentAbbrev,
      mascot: raw.opponentMascot,
      wins: raw.opponentSeasonWins,
      losses: raw.opponentSeasonLosses,
      ranking: raw.opponentRanking,
      espnID: raw.opponentESPNID,
    };
    this.opponent = new Team(opponentData);
    this.uniform = {
      helmet: getColor(raw.helmetColor),
      jersey: getColor(raw.jerseyColor),
      pants: getColor(raw.pantsColor),
    };
    this.overtime = raw.overtime;
  }
}

export class UpcomingGameSummary extends GameSummary {
  final = false;
  broadcast: string;
  constructor(raw: GameSummaryRawData) {
    super(raw);
    this.broadcast = raw.broadcast
  }
}

export class FinalGameSummary extends GameSummary {
  final = true;
  scoreSummary: Scoreboard;
  win: boolean;

  constructor(raw: GameSummaryRawData) {
    super(raw);
    this.win = raw.win as boolean;
    this.scoreSummary = {
      visitor: this.home ? this.opponent : this.NU,
      host: this.home ? this.NU : this.opponent,
      result: {
        home: this.home,
        win: this.win,
        homeScore: (this.home ? raw.score : raw.opponentScore) as number,
        awayScore: (this.home ? raw.opponentScore : raw.score) as number,
      },
    };
  }
}

export interface UniformSummaryGameData {
  gameOrder: number,
  home: boolean,
  date: string,
  title: string,
  opponentAbbrev: string,
  opponentRanking?: number,
  opponentLogo: string,
  opponentScore: number,
  overtime: number,
  score: number,
  season: number,
  week: number,
  win: boolean,
}

export class SimpleGame {
  order: number;
  season: number;
  week: number;
  route: string;
  homeTeam: SimpleTeam;
  homeScore: number;
  awayTeam: SimpleTeam;
  awayScore: number;
  title: string;
  opponent: string;
  win: boolean;
  home: boolean;
  constructor(game: UniformSummaryGameData) {
    this.order = game.gameOrder;
    this.season = game.season;
    this.week = game.week;
    this.route = `${game.season}/${game.week}`;
    this.opponent = `${game.home ? 'vs' : '@'} ${game.opponentAbbrev}`;
    const NU = new SimpleNU();
    const opponent = new SimpleTeam(game.opponentAbbrev, game.opponentLogo, game.opponentRanking);
    this.homeTeam = game.home ? NU : opponent;
    this.homeScore = game.home ? game.score : game.opponentScore;
    this.awayTeam = game.home ? opponent : NU;
    this.awayScore = game.home ? game.opponentScore : game.score;
    this.title = game.title || `${game.season} Week ${game.week}`;
    this.win = game.win;
    this.home = game.home;
  }
}

interface Stat {
  displayValue: string;
  label: string;
  name: string;
}

export interface GameDetailRawData extends UniformDetailResult {
  score1Q?: number;
  score2Q?: number;
  score3Q?: number;
  score4Q?: number;
  scoreOT?: number;
  opponentScore1Q?: number;
  opponentScore2Q?: number;
  opponentScore3Q?: number;
  opponentScore4Q?: number;
  opponentScoreOT?: number;
  tweetUrl?: string;
  stadium: string;
  city: string;
  zip: string;
  capacity: number;
  attendance?: number;
  bettingLine?: string;
  grass?: boolean;
  lastPlayed: string;
  firstPlayed: string;
  uniformAppearance: string,
  uniformCurrentTotal: number,
  uniformLosses: number,
  uniformWinPercent: string,
  uniformWins: number,
  stats: Stat[];
  opponentStats: Stat[];
};

export interface GameFullRawData extends GameSummaryRawData, GameDetailRawData {};
