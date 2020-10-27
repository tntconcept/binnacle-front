export interface ITimeBalance {
  timeToWork: number
  timeWorked: number
  timeDifference: number
}

export type ITimeBalanceApiResponse = Record<string, ITimeBalance>
