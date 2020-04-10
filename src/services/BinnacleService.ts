import React from "react"
import {firstDayOfFirstWeekOfMonth, lastDayOfLastWeekOfMonth} from "utils/DateUtils"
import {endOfMonth, isSameMonth, isThisMonth, startOfMonth, startOfYear, subDays} from "date-fns"
import {getActivitiesBetweenDate} from "api/ActivitiesAPI"
import {getHolidaysBetweenDate} from "api/HolidaysAPI"
import {getTimeBalanceBetweenDate} from "api/TimeBalanceAPI"
import {BinnacleActions, TBinnacleActions} from "core/contexts/BinnacleContext/BinnacleActions"
import {getRecentRoles} from "api/RoleAPI"

const buildTimeBalanceKey = (month: Date) => {
  const monthNumber = ('0' + (month.getMonth() + 1).toString()).slice(-2)
  return month.getFullYear() + "-" + monthNumber + "-01"
}

export const fetchBinnacleData = async (
  month: Date,
  isTimeCalculatedByYear: boolean,
  dispatch: React.Dispatch<TBinnacleActions>
) => {
  const firstDayOfFirstWeek = firstDayOfFirstWeekOfMonth(month);
  const lastDayOfLastWeek = lastDayOfLastWeekOfMonth(month);
  const today = new Date()

  const canFetchRecentRoles = isSameMonth(today, month) || isSameMonth(today, lastDayOfLastWeek)

  try {
    dispatch(BinnacleActions.changeGlobalLoading(true));

    const [activities, holidays, timeBalance, recentRoles] = await Promise.all([
      getActivitiesBetweenDate(firstDayOfFirstWeek, lastDayOfLastWeek),
      getHolidaysBetweenDate(firstDayOfFirstWeek, lastDayOfLastWeek),
      getTimeBalanceBetweenDate(startOfMonth(month), endOfMonth(month)),
      canFetchRecentRoles ? getRecentRoles() : undefined
    ]);

    dispatch(
      BinnacleActions.saveBinnacleData(
        month,
        activities,
        holidays,
        timeBalance[buildTimeBalanceKey(month)],
        recentRoles
      )
    );
  } catch (error) {
    dispatch(BinnacleActions.fetchGlobalFailed(error));
    throw error;
  }
};

export const fetchTimeBalanceByYear = async (
  month: Date,
  dispatch: React.Dispatch<TBinnacleActions>
) => {
  try {
    dispatch(BinnacleActions.changeLoadingTimeBalance(true));

    const endDate = isThisMonth(month) ? subDays(month, 1) : endOfMonth(month)
    const response = await getTimeBalanceBetweenDate(
      startOfYear(month),
      endDate
    );

    const amountOfMinutes = Object.values(response).reduce(
      (prevValue, currentValue) => ({
        timeWorked: prevValue.timeWorked + currentValue.timeWorked,
        timeToWork: prevValue.timeToWork + currentValue.timeToWork,
        timeDifference:
          prevValue.timeDifference + currentValue.timeDifference
      })
    );

    dispatch(BinnacleActions.updateTimeBalance(amountOfMinutes, true));
  } catch (error) {
    dispatch(BinnacleActions.changeLoadingTimeBalance(false));
    throw error;
  }
};

export const fetchTimeBalanceByMonth = async (
  month: Date,
  dispatch: React.Dispatch<TBinnacleActions>
) => {
  try {
    dispatch(BinnacleActions.changeLoadingTimeBalance(true));

    const lastValidDate = !isSameMonth(new Date(), month)
      ? endOfMonth(month)
      : new Date();

    const response = await getTimeBalanceBetweenDate(
      startOfMonth(month),
      lastValidDate
    );

    dispatch(BinnacleActions.changeLoadingTimeBalance(false));

    const key = buildTimeBalanceKey(month)

    dispatch(
      BinnacleActions.updateTimeBalance(
        {
          timeWorked: response[key].timeWorked,
          timeToWork: response[key].timeToWork,
          timeDifference:
            response[key].timeDifference
        },
        false
      )
    );
  } catch (error) {
    dispatch(BinnacleActions.changeLoadingTimeBalance(false));
    throw error;
  }
};
