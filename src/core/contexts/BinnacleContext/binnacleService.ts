import React from "react"
import {firstDayOfFirstWeekOfMonth, lastDayOfLastWeekOfMonth} from "utils/DateUtils"
import {endOfMonth, isSameMonth, startOfMonth, startOfYear, subDays} from "date-fns"
import {getActivitiesBetweenDate} from "api/ActivitiesAPI"
import {getHolidaysBetweenDate} from "api/HolidaysAPI"
import {getTimeBalanceBetweenDate} from "api/TimeBalanceAPI"
import {BinnacleActions, TBinnacleActions} from "core/contexts/BinnacleContext/binnacleActions"
import {getRecentRoles} from "api/RoleAPI"

export const fetchBinnacleData = async (
  month: Date,
  isTimeCalculatedByYear: boolean,
  dispatch: React.Dispatch<TBinnacleActions>
) => {
  const firstDayOfFirstWeek = firstDayOfFirstWeekOfMonth(month);
  const lastDayOfLastWeek = lastDayOfLastWeekOfMonth(month);

  const lastValidDate = !isSameMonth(new Date(), month)
    ? endOfMonth(month)
    : new Date();

  try {
    dispatch(BinnacleActions.changeGlobalLoading(true));

    const [activities, holidays, timeBalance, recentRoles] = await Promise.all([
      getActivitiesBetweenDate(firstDayOfFirstWeek, lastDayOfLastWeek),
      getHolidaysBetweenDate(firstDayOfFirstWeek, lastDayOfLastWeek),
      getTimeBalanceBetweenDate(startOfMonth(month), lastValidDate),
      // TODO DO NOT FETCH FREQUENT ROLES IF MONTH IS IN THE PAST
      getRecentRoles()
    ]);

    dispatch(
      BinnacleActions.saveBinnacleData(
        month,
        activities,
        holidays,
        timeBalance[lastValidDate.getMonth() + 1],
        recentRoles
      )
    );
  } catch (error) {
    dispatch(BinnacleActions.fetchGlobalFailed(error));
    throw error;
  }
};

export const fetchTimeBalanceByYear = async (
  year: Date,
  dispatch: React.Dispatch<TBinnacleActions>
) => {
  try {
    dispatch(BinnacleActions.changeLoadingTimeBalance(true));

    const untilYesterday = subDays(new Date(), 1);
    const response = await getTimeBalanceBetweenDate(
      startOfYear(year),
      untilYesterday
    );

    const amountOfMinutes = Object.values(response).reduce(
      (prevValue, currentValue) => ({
        minutesWorked: prevValue.minutesWorked + currentValue.minutesWorked,
        minutesToWork: prevValue.minutesToWork + currentValue.minutesToWork,
        differenceInMinutes:
          prevValue.differenceInMinutes + currentValue.differenceInMinutes
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

    dispatch(
      BinnacleActions.updateTimeBalance(
        {
          minutesWorked: response[month.getMonth() + 1].minutesWorked,
          minutesToWork: response[month.getMonth() + 1].minutesToWork,
          differenceInMinutes:
            response[month.getMonth() + 1].differenceInMinutes
        },
        false
      )
    );
  } catch (error) {
    dispatch(BinnacleActions.changeLoadingTimeBalance(false));
    throw error;
  }
};
