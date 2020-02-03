import {IActivity, IActivityDay} from "interfaces/IActivity"
import {IHolidaysResponse} from "interfaces/IHolidays"
import {ITimeTracker} from "interfaces/ITimeTracker"
import {TBinnacleActions} from "core/contexts/BinnacleContext/binnacleActions"
import produce from "immer"
import {isSameDay} from "date-fns"

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

const baseActivity: IActivity = {
  startDate: new Date(2020, 0, 2, 9, 0, 0),
  duration: 180,
  description: "Is Billable",
  billable: true,
  id: 1,
  userId: 200,
  organization: {
    id: 1000,
    name: "Organization Test"
  },
  project: {
    id: 2000,
    name: "Project Test",
    billable: true,
    open: true
  },
  projectRole: {
    id: 15,
    name: "Role Test"
  }
}

const activityDays: IActivityDay[] = [
  {
    date: new Date(2019, 10, 10),
    workedMinutes: 0,
    activities: [baseActivity]
  },
  {
    date: new Date(2019, 10, 11),
    workedMinutes: 0,
    activities: [baseActivity]
  },
  {
    date: new Date(2019, 10, 12),
    workedMinutes: 0,
    activities: [baseActivity]
  },
  {
    date: new Date(2019, 10, 13),
    workedMinutes: 0,
    activities: [baseActivity]
  },
  {
    date: new Date(2019, 10, 14),
    workedMinutes: 0,
    activities: [baseActivity]
  },
  {
    date: new Date(2019, 10, 15),
    workedMinutes: 0,
    activities: [baseActivity, baseActivity, baseActivity]
  },
  {
    date: new Date(2019, 10, 16),
    workedMinutes: 0,
    activities: [baseActivity]
  },
  {
    date: new Date(2019, 10, 17),
    workedMinutes: 0,
    activities: [baseActivity]
  },
  {
    date: new Date(2019, 10, 18),
    workedMinutes: 0,
    activities: [baseActivity]
  },
  {
    date: new Date(2019, 10, 19),
    workedMinutes: 0,
    activities: [baseActivity]
  },
  {
    date: new Date(2019, 10, 20),
    workedMinutes: 0,
    activities: [baseActivity]
  },
  {
    date: new Date(2019, 10, 21),
    workedMinutes: 0,
    activities: [baseActivity]
  },
  {
    date: new Date(2019, 10, 22),
    workedMinutes: 0,
    activities: [baseActivity]
  },
  {
    date: new Date(2019, 10, 22),
    workedMinutes: 0,
    activities: [baseActivity]
  },
  {
    date: new Date(2019, 10, 23),
    workedMinutes: 0,
    activities: [baseActivity]
  },
  {
    date: new Date(2019, 10, 24),
    workedMinutes: 0,
    activities: [baseActivity]
  }
]

export const initialBinnacleState: IBinnacleState = {
  loadingData: false,
  error: undefined,
  month: new Date(),
  activities: activityDays,
  holidays: {
    privateHolidays: {"1": []},
    publicHolidays: {"1": []}
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
      case "CHANGE_MONTH": {
        draft.month = action.month
        break
      }
      case "SAVE_BINNACLE_DATA": {
        draft.activities = action.activities
        draft.holidays = action.holidays
        draft.timeBalance = action.timeBalance
        break
      }
      case "CREATE_ACTIVITY": {
        const activityDate = action.activity.startDate;
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
