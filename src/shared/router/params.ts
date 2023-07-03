export interface ActivityParams {
  startDate: string
  endDate: string
}

export class Params {
  private constructor(readonly startDate: string, readonly endDate: string) {}

  static fromActivityParams(params: ActivityParams) {
    return new Params(params.startDate, params.endDate)
  }

  toURLParams() {
    const allParams = { startDate: this.startDate, endDate: this.endDate }
    return new URLSearchParams(allParams)
  }
}
