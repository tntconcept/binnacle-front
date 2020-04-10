export interface ITimeBalance {
  timeToWork: number;
  timeWorked: number;
  timeDifference: number;
}

export type ITimeBalanceResponse = Record<string, ITimeBalance>
