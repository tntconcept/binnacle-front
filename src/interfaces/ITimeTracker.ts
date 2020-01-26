export interface ITimeTracker {
  minutesToWork: number;
  minutesWorked: number;
  differenceInMinutes: number;
}

export type ITimeTrackerResponse = Record<string, ITimeTracker>