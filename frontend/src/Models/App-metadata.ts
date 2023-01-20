export interface AppMetadata {
  gameCount: number
  seasons: number[]
  seasonLengths: [Record<string,number>]
  helmetColor: string[]
  jerseyColor: string[]
  pantsColor: string[]
  opponent: string[]
  special: string[]
  stadiums: string[]
  broadcast: string[]
}

export const preloadMetadata: AppMetadata = {
  gameCount: 0,
  seasons: [],
  seasonLengths: [{}],
  helmetColor: [],
  jerseyColor: [],
  pantsColor: [],
  opponent: [],
  special: [],
  stadiums: [],
  broadcast: [],
}
