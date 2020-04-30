import React from "react";
import {
  firstDayOfFirstWeekOfMonth,
  formatDateForQuery,
  lastDayOfLastWeekOfMonth
} from "utils/DateUtils";
import { endOfMonth, isSameMonth, startOfMonth, startOfYear } from "date-fns";
import { getActivitiesBetweenDate } from "api/ActivitiesAPI";
import { getHolidaysBetweenDate, holidaysMapper } from "api/HolidaysAPI";
import { getTimeBalanceBetweenDate } from "api/TimeBalanceAPI";
import {
  BinnacleActions,
  TBinnacleActions
} from "core/contexts/BinnacleContext/BinnacleActions";
import { getRecentRoles } from "api/RoleAPI";
import endpoints from "api/endpoints";
import useSWR from "swr/esm/use-swr";
import { IActivityDay } from "api/interfaces/IActivity";
import { fetcher } from "core/contexts/UserContext";
import { IHolidaysResponse } from "api/interfaces/IHolidays";
import { IRecentRole } from "api/interfaces/IRecentRole";
import { activityDayMapper } from "api/ActivitiesAPI/mapper";

export const buildTimeBalanceKey = (month: Date) => {
  const monthNumber = ("0" + (month.getMonth() + 1).toString()).slice(-2);
  return month.getFullYear() + "-" + monthNumber + "-01";
};

const fetchAll = async (...urls: string[]) =>
  await Promise.all(urls.map(fetcher));

export const useCalendar = (month: Date) => {
  const firstDayOfFirstWeek = firstDayOfFirstWeekOfMonth(month);
  const lastDayOfLastWeek = lastDayOfLastWeekOfMonth(month);

  const startDate = formatDateForQuery(firstDayOfFirstWeek);
  const endDate = formatDateForQuery(lastDayOfLastWeek);

  const activities_endpoint_key =
    endpoints.activities + `?startDate=${startDate}&endDate=${endDate}`;
  const holidays_endpoint_key =
    endpoints.holidays + `?startDate=${startDate}&endDate=${endDate}`;
  const canFetchRecentRoles =
    isSameMonth(new Date(), month) ||
    isSameMonth(new Date(), lastDayOfLastWeek);

  const { data } = useSWR<any>(
    [
      activities_endpoint_key,
      holidays_endpoint_key,
      canFetchRecentRoles ? endpoints.recentProjectRoles : null
    ],
    fetchAll,
    {
      suspense: true
    }
  );

  const [activities, holidays, recentRoles] = data;

  return {
    activities: activities!.map(activityDayMapper) as IActivityDay[],
    holidays: holidaysMapper(holidays!) as IHolidaysResponse,
    recentRoles: recentRoles as IRecentRole | undefined
  };
};

export const fetchBinnacleData = async (
  month: Date,
  isTimeCalculatedByYear: boolean,
  dispatch: React.Dispatch<TBinnacleActions>
) => {
  const firstDayOfFirstWeek = firstDayOfFirstWeekOfMonth(month);
  const lastDayOfLastWeek = lastDayOfLastWeekOfMonth(month);
  const today = new Date();

  const canFetchRecentRoles =
    isSameMonth(today, month) || isSameMonth(today, lastDayOfLastWeek);

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

    const response = await getTimeBalanceBetweenDate(
      startOfYear(month),
      endOfMonth(month)
    );

    const onlySelectedYear = Object.fromEntries(
      Object.entries(response).filter(([key, val]) =>
        key.includes(month.getFullYear().toString())
      )
    );

    const totalTimeStats = Object.values(onlySelectedYear).reduce(
      (prevValue, currentValue) => ({
        timeWorked: prevValue.timeWorked + currentValue.timeWorked,
        timeToWork: prevValue.timeToWork + currentValue.timeToWork,
        timeDifference: prevValue.timeDifference + currentValue.timeDifference
      })
    );

    dispatch(BinnacleActions.updateTimeBalance(totalTimeStats, true));
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

    const key = buildTimeBalanceKey(month);
    dispatch(
      BinnacleActions.updateTimeBalance(
        {
          timeWorked: response[key].timeWorked,
          timeToWork: response[key].timeToWork,
          timeDifference: response[key].timeDifference
        },
        false
      )
    );
  } catch (error) {
    dispatch(BinnacleActions.changeLoadingTimeBalance(false));
    throw error;
  }
};
