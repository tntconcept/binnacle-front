import {IActivityDay} from "interfaces/IActivity"
import {IHolidaysResponse} from "interfaces/IHolidays"
import {ITimeTracker} from "interfaces/ITimeTracker"
import {TBinnacleActions} from "core/contexts/BinnacleContext/binnacleActions"
import produce from "immer"
import {isSameDay, parseISO} from "date-fns"

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
  activities: [],
  holidays: {
    privateHolidays: [],
    publicHolidays: []
  },
  timeBalance: {
    minutesToWork: 0,
    minutesWorked: 0,
    differenceInMinutes: 0
  },
  loadingTimeBalance: false,
  isTimeCalculatedByYear: false
}

export const binnacleReducer = (
  state: IBinnacleState,
  action: TBinnacleActions
): IBinnacleState => {
  return produce(state, draft => {
    switch (action.type) {
      case "SAVE_BINNACLE_DATA": {
        draft.month = action.month

        draft.activities = action.activities
        draft.holidays = action.holidays
        draft.timeBalance = action.timeBalance

        draft.loadingData = false
        draft.loadingTimeBalance = false

        break
      }
      case "CREATE_ACTIVITY": {
        const activityDate = parseISO(action.activity.startDate as unknown as string);
        const activityDayIndex = draft.activities.findIndex(activity =>
          isSameDay(activity.date, activityDate)
        );

        if (activityDayIndex > -1) {
          draft.activities[activityDayIndex].workedMinutes +=
            action.activity.duration;
          draft.activities[activityDayIndex].activities.push(action.activity);
          draft.timeBalance.minutesWorked += action.activity.duration;
          draft.timeBalance.differenceInMinutes =
            draft.timeBalance.minutesWorked - draft.timeBalance.minutesToWork;
        }
        break
      }
      case "UPDATE_ACTIVITY": {
        const activityDate = action.activity.startDate
        const activityDayIndex = draft.activities.findIndex(activity => isSameDay(activity.date, activityDate))
        const activityIndex = draft.activities[activityDayIndex].activities.findIndex(activity => activity.id === action.activity.id)

        if (activityDayIndex > -1 && activityIndex > -1) {

          const durationDifference = action.activity.duration - draft.activities[activityDayIndex].activities[activityIndex].duration

          draft.activities[activityDayIndex].workedMinutes += durationDifference
          draft.activities[activityDayIndex].activities[activityIndex] = action.activity
          draft.timeBalance.minutesWorked += durationDifference
          draft.timeBalance.differenceInMinutes = draft.timeBalance.minutesWorked - draft.timeBalance.minutesToWork
        }

        break
      }
      case "DELETE_ACTIVITY": {
        const activityDate = action.activity.startDate
        const activityDayIndex = draft.activities.findIndex(activity => isSameDay(activity.date, activityDate))
        const activityIndex = draft.activities[activityDayIndex].activities.findIndex(activity => activity.id === action.activity.id)

        if (activityDayIndex > -1 && activityIndex > -1) {
          draft.activities[activityDayIndex].workedMinutes -= action.activity.duration
          draft.activities[activityDayIndex].activities.splice(activityIndex, 1);
          draft.timeBalance.minutesWorked -= action.activity.duration
          draft.timeBalance.differenceInMinutes = draft.timeBalance.minutesWorked - draft.timeBalance.minutesToWork
        }

        break
      }

      case "CHANGE_GLOBAL_LOADING": {
        draft.loadingData = action.loadingData
        draft.loadingTimeBalance = action.loadingData
        break
      }
      case "FETCH_GLOBAL_FAILED": {
        draft.loadingData = false
        draft.loadingTimeBalance = false
        draft.error = action.error
        break
      }
      case "CHANGE_LOADING_TIME_BALANCE": {
        draft.loadingTimeBalance = action.loadingTimeBalance
        break
      }
      case "UPDATE_TIME_BALANCE": {
        draft.timeBalance = action.timeBalance
        draft.isTimeCalculatedByYear = action.isCalculatedByYear
        break
      }
      default:
        return draft
    }
  })
}
