import {IActivity, IActivityDay} from "interfaces/IActivity"
import {IHolidaysResponse} from "interfaces/IHolidays"
import {ITimeTracker} from "interfaces/ITimeTracker"
import {ActionType} from "interfaces/ActionType"

export type TBinnacleActions = ActionType<typeof BinnacleActions>;

export const BinnacleActions = {
  changeMonth: (month: Date) => {
    return {
      type: "CHANGE_MONTH",
      month
    } as const;
  },
  createActivity: (activity: IActivity) => {
    return {
      type: "CREATE_ACTIVITY",
      activity
    } as const;
  },
  changeGlobalLoading: (loading: boolean) => {
    return {
      type: "CHANGE_LOADING_STATE",
      loadingData: loading
    } as const;
  },
  fetchGlobalFailed: (error: Error) => {
    return {
      type: "FETCH_FAILED",
      error
    } as const;
  },
  saveBinnacleData: (activities: IActivityDay[], holidays: IHolidaysResponse, timeBalance: ITimeTracker) => {
    return {
      type: "SAVE_BINNACLE_DATA",
      activities,
      holidays,
      timeBalance
    } as const
  },
  changeLoadingTimeBalance: (loading: boolean) => {
    return {
      type: "CHANGE_LOADING_TIME_STATE",
      loadingTimeBalance: loading
    } as const
  },
  updateTimeBalance: (timeBalance: ITimeTracker) => {
    return {
      type: "UPDATE_TIME_BALANCE",
      timeBalance: timeBalance
    } as const
  }
};
