import {IActivityDay} from "interfaces/IActivity"
import {useReducer} from "react"
import {IHolidaysResponse} from "interfaces/IHolidays"
import {ITimeTracker} from "interfaces/ITimeTracker"
import {TBinnacleActions} from "core/controllers/binnacleActions"

export interface IBinnacleState {
  loadingData: boolean;
  error: Error | undefined;
  month: Date;
  activities: IActivityDay[];
  holidays: IHolidaysResponse;
  timeBalance: ITimeTracker;
  loadingTimeBalance: boolean;
  isTimeCalculatedByYear: boolean;
}

export const initialBinnacleState: IBinnacleState = {
  loadingData: false,
  error: undefined,
  month: new Date(),
  activities: [] as IActivityDay[],
  holidays: {
    privateHolidays: { "1": [] },
    publicHolidays: { "1": [] }
  },
  timeBalance: undefined!,
  loadingTimeBalance: false,
  isTimeCalculatedByYear: false
};

export const binnacleReducer = (
  state: IBinnacleState,
  action: TBinnacleActions
): IBinnacleState => {
  switch (action.type) {
    case "CHANGE_MONTH":
      return { ...state, month: action.month };
    case "CREATE_ACTIVITY":
      return state;
    default:
      return state;
  }
};

export default function useBinnacleReducer(state = initialBinnacleState) {
  return useReducer(binnacleReducer, state);
}
