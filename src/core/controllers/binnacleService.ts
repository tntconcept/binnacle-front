import React from "react"
import {firstDayOfFirstWeekOfMonth, lastDayOfLastWeekOfMonth} from "utils/calendarUtils"
import {endOfMonth, isSameMonth, startOfMonth, startOfYear, subDays} from "date-fns"
import {getActivitiesBetweenDate} from "services/activitiesService"
import {getHolidaysBetweenDate} from "services/holidaysService"
import {getTimeBalanceBetweenDate} from "services/timeTrackingService"
import {BinnacleActions, TBinnacleActions} from "core/controllers/binnacleActions"

export const fetchBinnacleData = async (month: Date, isTimeCalculatedByYear: boolean, dispatch: React.Dispatch<TBinnacleActions>) => {
  const firstDayOfFirstWeek = firstDayOfFirstWeekOfMonth(month);
  const lastDayOfLastWeek = lastDayOfLastWeekOfMonth(month);

  const lastValidDate = !isSameMonth(new Date(), month)
    ? endOfMonth(month)
    : new Date();

  try {
    dispatch(BinnacleActions.changeGlobalLoading(true))

    const [activities, holidays, timeBalance] = await Promise.all([
      getActivitiesBetweenDate(firstDayOfFirstWeek, lastDayOfLastWeek),
      getHolidaysBetweenDate(firstDayOfFirstWeek, lastDayOfLastWeek),
      getTimeBalanceBetweenDate(startOfMonth(month), lastValidDate)
    ]);

    dispatch(BinnacleActions.saveBinnacleData(activities, holidays, timeBalance))

  } catch (error) {
    dispatch(BinnacleActions.fetchGlobalFailed(error))
    throw error
  }
}


export const fetchTimeBalanceByYear = async (year: Date, dispatch: React.Dispatch<TBinnacleActions>) => {
  try {
    dispatch(BinnacleActions.changeLoadingTimeBalance(true))

    const yesterdayDate = subDays(new Date(), 1)
    const response = await getTimeBalanceBetweenDate(
      startOfYear(year),
      yesterdayDate
    )

    const amountOfMinutes = Object.values(response).reduce(
      (t, n) => t + n.differenceInMinutes,
      0
    )

    dispatch(BinnacleActions.changeLoadingTimeBalance(true))

    dispatch(BinnacleActions.updateTimeBalance({
      minutesWorked: response.minutesWorked,
      minutesToWork: response.minutesToWork,
      differenceInMinutes: amountOfMinutes
    }))
  } catch (error) {
    dispatch(BinnacleActions.changeLoadingTimeBalance(false))
    throw error
  }
}

export const fetchTimeBalanceByMonth = async (month: Date, dispatch: React.Dispatch<TBinnacleActions>) => {
  try {
    dispatch(BinnacleActions.changeLoadingTimeBalance(true))

    const lastValidDate = !isSameMonth(new Date(), month)
      ? endOfMonth(month)
      : new Date()

    const response = await getTimeBalanceBetweenDate(
      startOfMonth(month),
      lastValidDate
    )

    dispatch(BinnacleActions.changeLoadingTimeBalance(false))

    dispatch(BinnacleActions.updateTimeBalance({
      minutesWorked: response.minutesWorked,
      minutesToWork: response.minutesToWork,
      differenceInMinutes: response.differenceInMinutes
    }))
  } catch (error) {
    dispatch(BinnacleActions.changeLoadingTimeBalance(false))
    throw error
  }
}