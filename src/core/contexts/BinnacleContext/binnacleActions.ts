import {IActivity, IActivityDay} from "interfaces/IActivity"
import {IHolidaysResponse} from "interfaces/IHolidays"
import {ITimeTracker} from "interfaces/ITimeTracker"
import {ActionType} from "interfaces/ActionType"
import {IRecentRole} from "interfaces/IRecentRole"

export type TBinnacleActions = ActionType<typeof BinnacleActions>;

export const BinnacleActions = {
  createActivity: (activity: IActivity) => {
    return {
      type: "CREATE_ACTIVITY",
      activity
    } as const;
  },
  updateActivity: (activity: IActivity) => {
    return {
      type: "UPDATE_ACTIVITY",
      activity
    } as const;
  },
  deleteActivity: (activity: IActivity) => {
    return {
      type: "DELETE_ACTIVITY",
      activity
    } as const;
  },
  changeGlobalLoading: (loading: boolean) => {
    return {
      type: "CHANGE_GLOBAL_LOADING",
      loadingData: loading
    } as const;
  },
  fetchGlobalFailed: (error: Error) => {
    return {
      type: "FETCH_GLOBAL_FAILED",
      error
    } as const;
  },
  saveBinnacleData: (month: Date, activities: IActivityDay[], holidays: IHolidaysResponse, timeBalance: ITimeTracker, recentRoles: IRecentRole[]) => {
    return {
      type: "SAVE_BINNACLE_DATA",
      month,
      activities,
      holidays,
      timeBalance,
      recentRoles
    } as const
  },
  changeLoadingTimeBalance: (loading: boolean) => {
    return {
      type: "CHANGE_LOADING_TIME_BALANCE",
      loadingTimeBalance: loading
    } as const
  },
  updateTimeBalance: (timeBalance: ITimeTracker, isCalculatedByYear: boolean) => {
    return {
      type: "UPDATE_TIME_BALANCE",
      timeBalance,
      isCalculatedByYear
    } as const
  },
  addRecentRole: (newRole: IRecentRole) => {
    return {
      type: "ADD_RECENT_ROLE",
      newRole
    } as const
  },
  updateLastImputedRole: (lastRole: IRecentRole) => {
    return {
      type: "UPDATE_LAST_IMPUTED_ROLE",
      lastRole
    } as const
  }
};
