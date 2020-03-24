export interface ITimeBalance {
  minutesToWork: number;
  minutesWorked: number;
  differenceInMinutes: number;
}

export type ITimeBalanceResponse = Record<string, ITimeBalance>
