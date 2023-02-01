export enum Filterables {
  season = "season",
  home = "home",
  opponent = "opponent",
  helmetColor = "helmetColor",
  jerseyColor = "jerseyColor",
  pantsColor = "pantsColor",
  special = "special",
  broadcast = "broadcast",
  win = "win",
}

export class FilterState {
  private map: Partial<Record<Filterables, string>> = {}

  constructor(query: string) {
    const parts = query.split('&');

  }

  getQuery() {
    return Object.keys(this.map).map(key => `${key}=${this.map[key as Filterables]}`).join('&')
  }


}