import { GameDetail, newGameDetail } from "./Game-detail/Game-detail-model";
import { GameFullRawData, GameSummary, GameSummaryRawData, newGameSummary, Uniform, UniformInfo, UniformInfoResult, UniformListResult, UniformTimelineData, UniformTimelineResult } from "./Models";
import { AppMetadata } from "./Models/App-metadata";

abstract class APIRequest<T> {
  abstract get URL(): string;
  hostURL = '/api'
  abstract asPromise(): Promise<T>
  protected request<T extends unknown>() {
    return fetch(this.URL, { cache: 'no-cache' })
      .then(res => res.json() as T)
  }
}

export class DataSummaryRequest extends APIRequest<AppMetadata> {
  get URL(): string {
    return `${this.hostURL}/data-summary`;
  }
  asPromise(): Promise<AppMetadata> {
    return this.request<AppMetadata>()
  }
}

export class GameSummaryRequest extends APIRequest<GameSummary[]> {
  private range: string;
  get URL(): string {
    return `${this.hostURL}/games/${this.range}`;
  }
  constructor(private skip = 0, private top = 10) {
    super()
    const rangeEnd = skip + top;
    this.range = `${skip}-${rangeEnd}`;
  }

  asPromise(): Promise<GameSummary[]> {
    return this.request<GameSummaryRawData[]>()
      .then(data => data.map(raw => newGameSummary(raw)));
  }
}

export class SingleGameDetailRequest extends APIRequest<GameDetail> {
  get URL(): string {
    return `${this.hostURL}/game/${this.year}/${this.week}`;
  }
  constructor(private year: string, private week: string) {
    super()
  }

  asPromise(): Promise<GameDetail> {
    return this.request<GameFullRawData>()
      .then(data => newGameDetail(data));
  }
}

export class LatestGameDetailRequest extends APIRequest<GameDetail> {
  get URL(): string {
    return `${this.hostURL}/game`;
  }
  asPromise(): Promise<GameDetail> {
    return this.request<GameFullRawData>()
      .then(data => newGameDetail(data))
  }
}

export class UniformListRequest extends APIRequest<Uniform[]> {
  get URL(): string {
    return `${this.hostURL}/uniforms`;
  }
  asPromise() {
    return this.request<UniformListResult[]>()
      .then(res => res.map(data => new Uniform(
        data.helmetColor, data.jerseyColor, data.pantsColor,
        data.firstPlayed, data.lastPlayed, data.winPercent,
        data.total, data.wins, data.losses
        ))
      )
  }
}

export class UniformSummaryRequest extends APIRequest<Uniform> {
  get URL(): string {
    return `${this.hostURL}/uniform/${this.combination}/summary`
  }
  constructor(private combination: string) {
    super()
  }
  asPromise() {
    return this.request<UniformListResult>()
    .then(data => new Uniform(
      data.helmetColor, data.jerseyColor, data.pantsColor,
      data.firstPlayed, data.lastPlayed, data.winPercent,
      data.total, data.wins, data.losses
      )
    )
  }
}

export class UniformInfoRequest extends APIRequest<UniformInfo> {
  get URL(): string {
    return `${this.hostURL}/uniform/${this.combination}/detail`
  }
  constructor(private combination: string) {
    super()
  }
  asPromise() {
    return this.request<UniformInfoResult>()
      .then(res => new UniformInfo(res))
  }
}

export class UniformTimelineRequest extends APIRequest<UniformTimelineData[]> {
  get URL(): string {
    return `${this.hostURL}/uniforms/timeline`
  }
  asPromise() {
    return this.request<UniformTimelineResult[]>()
      .then(res => res.map(({ helmetColor, jerseyColor, pantsColor, gameData }) => {
        return new UniformTimelineData(helmetColor, jerseyColor, pantsColor, gameData);
      }));
  }
}
