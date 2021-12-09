export interface TeamData extends TeamStats {
  name: string;
  abbrev: string;
  mascot: string;
  espnID: string;
}

export interface TeamStats {
  wins: number;
  losses: number;
  ranking?: number;
}

abstract class TeamWithLogo {
  get logoURL() {
    return `https://a.espncdn.com/i/teamlogos/ncaa/500/${this.espnID}.png`;
  }
  get logoAlt() {
    return `${this.abbrev} logo`;
  }

  constructor(private espnID: string, public abbrev: string) {}
}

export class SimpleTeam extends TeamWithLogo {
  isNU = false;

  get name() {
    return `${this.ranking ? `#${this.ranking} ` : ''}${this.abbrev}`;
  }

  constructor(public abbrev: string, logo: string, public ranking?: number) {
    super(logo, abbrev)
  }
}

export class SimpleNU extends SimpleTeam {
  isNU = true;
  constructor(ranking?: number) {
    super('NU', '77', ranking)
  }
}

export class Team extends TeamWithLogo {
  isNU = false;
  name: string;
  mascot: string;
  get fullName() {
    return `${this.ranking}${this.name} ${this.mascot}`;
  }
  get shortName() {
    return `${this.ranking}${this.name}`;
  }

  wins: number;
  losses: number;
  get record() {
    return `${this.wins} - ${this.losses}`;
  }
  ranking: string;

  constructor(data: TeamData) {
    super(data.espnID, data.abbrev);
    this.name = data.name;
    this.mascot = data.mascot;
    this.wins = data.wins;
    this.losses = data.losses;
    this.ranking = data.ranking ? `#${data.ranking} ` : '';
  }
}

export class NU extends Team {
  constructor(data: TeamStats) {
    super({ ...data, name: 'Northwestern', mascot: 'Wildcats', abbrev: 'NU', espnID: '77' });
    this.isNU = true;
  }
}
