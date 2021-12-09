import { parseJSON } from "date-fns";
import { SimpleGame, UniformSummaryGameData } from "./Game";

export const enum Colors {
  purple = 'purple',
  white = 'white',
  black = 'black',
  gray = 'gray',
};

const colorMap: Record<string, Colors> = {
  'purple': Colors.purple,
  'white': Colors.white,
  'black': Colors.black,
  'gray': Colors.gray,
};

export function getColor(raw: string): Colors {
  return colorMap[raw] || Colors.white;
};

export interface UniformDetailResult {
  helmetDetail: string;
  jerseyLetterColor: string;
  jerseyStripeDetail: string;
  pantsDetail: string;
  special: string;
}

export interface UniformListResult {
  firstPlayed: string,
  helmetColor: string,
  jerseyColor: string
  lastPlayed: string,
  losses: number
  pantsColor: string,
  total: number,
  winPercent: string,
  wins: number,
}

interface UniformGameStats {
  firstPlayed: Date,
  lastPlayed: Date,
  losses: number
  total: number,
  winPercent: string,
  wins: number,
}

export interface UniformInfoResult extends UniformListResult {
  gameData: UniformSummaryGameData[],
  uniformVariations: (UniformListResult & UniformDetailResult & {
    games: UniformSummaryGameData[],
  })[]
}

export interface UniformColors {
  helmet: Colors,
  jersey: Colors,
  pants: Colors,
};

export class Uniform implements UniformColors, UniformGameStats {
  helmet: Colors;
  jersey: Colors;
  pants: Colors;

  firstPlayed: Date;
  lastPlayed: Date;
  constructor(
    helmet: string, jersey: string, pants: string,
    firstPlayed: string, lastPlayed: string,
    public winPercent: string, public total: number,
    public wins: number, public losses: number,
  ) {
    this.helmet = getColor(helmet);
    this.jersey = getColor(jersey);
    this.pants = getColor(pants);

    this.firstPlayed = parseJSON(firstPlayed);
    this.lastPlayed = parseJSON(lastPlayed);
  }
}

export class UniformInfo extends Uniform {
  gameData: SimpleGame[];
  uniformVariations: (UniformDetail & UniformGameStats & {
    games: SimpleGame[],
  })[]

  constructor(raw: UniformInfoResult) {
    super(raw.helmetColor, raw.jerseyColor, raw.pantsColor,
      raw.firstPlayed, raw.lastPlayed, raw.winPercent, raw.total,
      raw.wins, raw.losses);
      this.gameData = raw.gameData.map(data => new SimpleGame(data));
      this.uniformVariations = raw.uniformVariations.map(data => {
        const detail = new UniformDetail(data.helmetColor, data.helmetDetail,
          data.jerseyColor, data.jerseyLetterColor, data.jerseyStripeDetail,
          data.pantsColor, data.pantsDetail, data.special);
        const { wins, losses, winPercent, total } = data;
        return {
          ...detail,
          firstPlayed: parseJSON(data.firstPlayed),
          lastPlayed: parseJSON(data.lastPlayed),
          wins, losses, winPercent, total,
          games: data.games.map(game => new SimpleGame(game)),
        };
      });
  }
}

export interface UniformTimelineResult {
  helmetColor: string,
  jerseyColor: string,
  pantsColor: string,
  gameData: UniformSummaryGameData[]
}

export class UniformTimelineData implements UniformColors {
  helmet: Colors;
  jersey: Colors;
  pants: Colors;
  gameData: SimpleGame[];
  axisLabel: string;

  constructor(
    helmet: string, jersey: string, pants: string, gameData: UniformSummaryGameData[]
  ) {
    this.helmet = getColor(helmet);
    this.jersey = getColor(jersey);
    this.pants = getColor(pants);
    this.axisLabel = `${helmet}-${jersey}-${pants}`;
    this.gameData = gameData.map(data => new SimpleGame(data));
  }
}

export class UniformDetail implements UniformColors {
  helmet: Colors;
  jersey: Colors;
  pants: Colors;

  helmetDesc: string;
  pantsDesc: string;
  constructor(
    helmet: string, public helmetDetail: string,
    jersey: string, public jerseyLetter: string, public jerseyDetail: string,
    pants: string, public pantsDetail: string, public special?: string,
  ) {
    this.helmet = getColor(helmet);
    this.jersey = getColor(jersey);
    this.pants = getColor(pants);

    this.helmetDesc = `${helmet}${helmetDetail ? ` + ${helmetDetail}` : ''}`;
    this.pantsDesc = `${pants}${pantsDetail ? ` + ${pantsDetail}` : ''}`;
  }
}
