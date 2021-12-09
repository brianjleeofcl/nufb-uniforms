export interface ESPNSummaryResult {
  events: Event[],
  requestedSeason: {
    year: number,
    type: number,
  }
}

export interface Event {
  id: string;
  date: string;
  season: {
    year: number;
    displayName: string;
  };
  week: {
    number: number;
    text: string;
  };
  competitions: [{
    attendance: number;
    venue: {
      fullName: string;
      address: {
        city: string;
        state: string;
        zipCode: string;
      }
    };
    competitors: {
      id: string;
      homeAway: string;
      winner: boolean;
      team: {
        id: string;
        location: string;
        abbreviation: string;
        shortDisplayName: string;
      };
      score: {
        value: number;
        displayValue: string;
      };
      curatedRank: {
        current: number;
      };
      record: {
        type: string;
        displayValue: string;
      }[];
    }[];
    notes: {
      type: string; // "event"
      headline: string; // bowls, ccg
    }[]
    broadcasts: {
      media: {
        shortName: string;
      }
    }[];
    status: {
      type: {
        name: string;
        completed: boolean;
      }
    }
  }];
}

export interface ESPNDetailResult {
  boxscore: {
    teams: {
      team: {
        id: string;
        location: string;
      }
      statistics: {
        name: string;
        displayValue: string;
        label: string;
      }[]
    }[]
  }
  gameInfo: {
    venue: {
      capacity: number;
      grass: boolean;
      fullName: string,
      address: {
          city: string,
          state: string,
          zipCode: string,
      },
    };
    attendance: number;
  }
  header: {
    competitions: [{
      date: string,
      conferenceCompetition: boolean,
      neutralSite: boolean,
      competitors: {
        homeAway: string,
        winner: boolean,
        team: {
          location: string;
        };
        score: string;
        linescores: {
          displayValue: string;
        }[];
        rank?: number;
        record: {
          type: string;
          displayValue: string;
        }[];
      }[];
      broadcasts: [{
        media: {
          shortName: string
        }
      }];
      status: {
        type: {
          completed: boolean
        }
      }
    }];
    gameNote: string;
  }
  pickcenter: {
    details: string;
    overUnder: number;
  }[]
}

export interface TeamResult {
  team: {
    record: {
      items: {
        type: string,
        summary: string,
      }[]
    }
  }
}

export interface SeasonBulkData {
  final: boolean;
  canceled: boolean;
  gameESPNID: string;
  gameDate: string;
  season: number;
  canonicalWeek: number;
  opponent: string;
  opponentMascot: string;
  opponentAbbrev: string;
  opponentESPNID: string;
  home: boolean;
  win?: boolean;
  score?: number;
  opponentScore?: number;
  stadium: string;
  city: string;
  zip: string;
  attendance: number;
  ranking?: number;
  regularSeason: boolean;
  opponentRanking?: number;
  broadcast?: string;
  seasonWins?: number;
  seasonLosses?: number;
  opponentSeasonWins?: number;
  opponentSeasonLosses?: number;
};

export interface FullGameData extends SeasonBulkData {
  score1Q: number;
  score2Q: number;
  score3Q: number;
  score4Q: number;
  scoreOT?: number;
  opponentScore1Q: number;
  opponentScore2Q: number;
  opponentScore3Q: number;
  opponentScore4Q: number;
  opponentScoreOT?: number;
  grassField: boolean;
  overtime: number;
  capacity: number;
  bettingLine: string;
  stats: string;
  opponentStats: string;
  title?: string;
}

const flattenedBlankData: Required<FullGameData> = {
  final: false,
  canceled: true,
  score: 0,
  score1Q: 0,
  score2Q: 0,
  score3Q: 0,
  score4Q: 0,
  scoreOT: 0,
  opponent: '',
  opponentESPNID: '',
  opponentAbbrev: '',
  opponentMascot: '',
  opponentScore: 0,
  opponentScore1Q: 0,
  opponentScore2Q: 0,
  opponentScore3Q: 0,
  opponentScore4Q: 0,
  opponentScoreOT: 0,
  grassField: false,
  overtime: 0,
  gameESPNID: '',
  gameDate: '',
  season: 0,
  canonicalWeek: 0,
  home: false,
  win: false,
  stadium: '',
  city: '',
  zip: '',
  capacity: 0,
  attendance: 0,
  bettingLine: '',
  ranking: 0,
  regularSeason: false,
  opponentRanking: 0,
  seasonWins: 0,
  seasonLosses: 0,
  opponentSeasonWins: 0,
  opponentSeasonLosses: 0,
  broadcast: '',
  opponentStats: '',
  stats: '',
  title: ''
};

export const dataKeys = Object.keys(flattenedBlankData).sort() as (keyof FullGameData)[];
