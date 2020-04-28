import {IActivityDay} from "api/interfaces/IActivity"
import {IHolidaysResponse} from "api/interfaces/IHolidays"
import {ITimeBalance} from "api/interfaces/ITimeBalance"
import {TBinnacleActions} from "core/contexts/BinnacleContext/BinnacleActions"
import {addDays, isAfter, isFuture, isSameDay, isSameMonth, subMonths} from "date-fns"
import produce from "immer"
import {IRecentRole} from "api/interfaces/IRecentRole"
import {buildActivity} from "utils/generateTestMocks"

export interface IBinnacleState {
  loadingData: boolean;
  error: Error | undefined;
  month: Date;
  activities: IActivityDay[];
  holidays: IHolidaysResponse;
  timeBalance: ITimeBalance;
  loadingTimeBalance: boolean;
  isTimeCalculatedByYear: boolean;
  recentRoles: IRecentRole[];
  lastImputedRole?: IRecentRole;
}

const seedActivities = () => {
  const ac = []

  for (let i = 0; i <= 35; i++) {
    ac.push({
      date: addDays(new Date(), i),
      workedMinutes: 0,
      activities: [buildActivity()]
    })
  }

  return ac
}

export const initialBinnacleState: IBinnacleState = {
  loadingData: false,
  error: undefined,
  month: new Date(),
  activities: seedActivities(),
  holidays: {
    privateHolidays: [],
    publicHolidays: []
  },
  timeBalance: {
    timeWorked: 0,
    timeToWork: 0,
    timeDifference: 0
  },
  loadingTimeBalance: false,
  isTimeCalculatedByYear: false,
  recentRoles: [],
  lastImputedRole: undefined
};

export const binnacleReducer = (
  state: IBinnacleState,
  action: TBinnacleActions
): IBinnacleState => {
  return produce(state, draft => {
    switch (action.type) {
      case "SAVE_BINNACLE_DATA": {
        draft.month = action.month;

        draft.activities = action.activities;
        draft.holidays = action.holidays;
        draft.timeBalance = action.timeBalance;
        draft.recentRoles = action.recentRoles;

        const lastImputedRole = getLastImputedRole(action.activities);
        if (lastImputedRole) {
          draft.lastImputedRole = lastImputedRole;
        }

        draft.loadingData = false;
        draft.loadingTimeBalance = false;
        break;
      }
      case "CREATE_ACTIVITY": {
        const activityDayIndex = draft.activities.findIndex(activity =>
          isSameDay(activity.date, action.activity.startDate)
        );

        if (activityDayIndex > -1) {
          draft.activities[activityDayIndex].workedMinutes +=
            action.activity.duration;
          draft.activities[activityDayIndex].activities.push(action.activity);

          if (isSameMonth(draft.month, action.activity.startDate)) {
            draft.timeBalance.timeWorked += action.activity.duration;
            draft.timeBalance.timeDifference += action.activity.duration
          }
        }
        break;
      }
      case "UPDATE_ACTIVITY": {
        const activityDate = action.activity.startDate;
        const activityDayIndex = draft.activities.findIndex(activity =>
          isSameDay(activity.date, activityDate)
        );
        const activityIndex = draft.activities[
          activityDayIndex
        ].activities.findIndex(activity => activity.id === action.activity.id);

        if (activityDayIndex > -1 && activityIndex > -1) {
          const durationDifference =
            action.activity.duration -
            draft.activities[activityDayIndex].activities[activityIndex]
              .duration;

          draft.activities[activityDayIndex].activities[activityIndex] =
            action.activity;

          draft.activities[
            activityDayIndex
          ].workedMinutes += durationDifference;

          if (isSameMonth(draft.month, action.activity.startDate)) {
            draft.timeBalance.timeWorked += durationDifference;
            draft.timeBalance.timeDifference += durationDifference;
          }
        }

        break;
      }
      case "DELETE_ACTIVITY": {
        const activityDate = action.activity.startDate;
        const activityDayIndex = draft.activities.findIndex(activity =>
          isSameDay(activity.date, activityDate)
        );
        const activityIndex = draft.activities[
          activityDayIndex
        ].activities.findIndex(activity => activity.id === action.activity.id);

        if (activityDayIndex > -1 && activityIndex > -1) {
          draft.activities[activityDayIndex].workedMinutes -=
            action.activity.duration;
          draft.activities[activityDayIndex].activities.splice(
            activityIndex,
            1
          );

          if (isSameMonth(draft.month, action.activity.startDate)) {
            draft.timeBalance.timeWorked -= action.activity.duration;
            draft.timeBalance.timeDifference -= action.activity.duration
          }
        }

        const lastImputedRole = getLastImputedRole(draft.activities);
        if (lastImputedRole) {
          draft.lastImputedRole = lastImputedRole;
        }

        break;
      }

      case "CHANGE_GLOBAL_LOADING": {
        draft.loadingData = action.loadingData;
        draft.loadingTimeBalance = action.loadingData;
        break;
      }
      case "FETCH_GLOBAL_FAILED": {
        draft.loadingData = false;
        draft.loadingTimeBalance = false;
        draft.error = action.error;
        break;
      }
      case "CHANGE_LOADING_TIME_BALANCE": {
        draft.loadingTimeBalance = action.loadingTimeBalance;
        break;
      }
      case "UPDATE_TIME_BALANCE": {
        draft.timeBalance = action.timeBalance;
        draft.isTimeCalculatedByYear = action.isCalculatedByYear;
        draft.loadingTimeBalance = false;
        break;
      }
      case "ADD_RECENT_ROLE": {
        if (roleDateIsValid(action.newRole.date)) {
          const roleNotFound =
            draft.recentRoles.findIndex(a => a.id === action.newRole.id) === -1;
          if (roleNotFound) {
            draft.recentRoles.push(action.newRole);
            draft.lastImputedRole = action.newRole;
          }
        }

        break;
      }
      case "UPDATE_LAST_IMPUTED_ROLE": {
        draft.lastImputedRole = action.lastRole;
        break;
      }
      default:
        return draft;
    }
  });
};

const roleDateIsValid = (roleDate: Date) => {
  const lastValidDate = subMonths(new Date(), 1);

  const isLastValidDay = isSameDay(lastValidDate, roleDate);
  const isAfterLastValidDay = isAfter(roleDate, lastValidDate);
  const isNotInTheFuture = !isFuture(roleDate);

  return isLastValidDay || (isAfterLastValidDay && isNotInTheFuture);
};

const getLastImputedRole = (activities: IActivityDay[]) => {
  const imputedDays = activities.filter(a => a.activities.length > 0);
  const lastImputedDay = imputedDays[imputedDays.length - 1];

  if (lastImputedDay) {
    const lastActivity =
      lastImputedDay.activities[lastImputedDay.activities.length - 1];
    return {
      id: lastActivity.projectRole.id,
      name: lastActivity.projectRole.name,
      date: lastActivity.startDate,
      projectName: lastActivity.project.name,
      projectBillable: lastActivity.project.billable
    };
  }

  return undefined;
};
