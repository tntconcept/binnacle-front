import {endOfMonth, startOfMonth, startOfYear} from "date-fns"
import {getTimeBalanceBetweenDate} from "api/TimeBalanceAPI"
import ActivitiesAPI from "api/ActivitiesAPI/ActivitiesAPI"
import {firstDayOfFirstWeekOfMonth, lastDayOfLastWeekOfMonth} from "utils/DateUtils"
import {getHolidaysBetweenDate} from "api/HolidaysAPI"
import {getRecentRoles} from "api/RoleAPI"
import DateTime from "services/DateTime"

const buildTimeBalanceKey = (month: Date) => {
  const monthNumber = ("0" + (month.getMonth() + 1).toString()).slice(-2)
  return month.getFullYear() + "-" + monthNumber + "-01"
}

class Resources {
  async fetchTimeBalance(month: Date, mode: "by_month" | "by_year") {
    const promise = mode === "by_month"
      ? BinnacleResourcesService.fetchTimeDataByMonth(month)
      : BinnacleResourcesService.fetchTimeDataByYear(month)

    return await promise
  }

  async fetchTimeDataByMonth(month: Date) {
    const startDate = startOfMonth(month)
    const endDate = endOfMonth(month)

    const data = await getTimeBalanceBetweenDate(startDate, endDate)

    return data[buildTimeBalanceKey(month)]
  }

  async fetchTimeDataByYear(month: Date) {
    const response = await getTimeBalanceBetweenDate(
      startOfYear(month),
      endOfMonth(month)
    )

    const onlySelectedYear = Object.fromEntries(
      Object.entries(response).filter(([key]) =>
        key.includes(month.getFullYear().toString())
      )
    )

    const totalTimeStats = Object.values(onlySelectedYear).reduce(
      (prevValue, currentValue) => ({
        timeWorked: prevValue.timeWorked + currentValue.timeWorked,
        timeToWork: prevValue.timeToWork + currentValue.timeToWork,
        timeDifference: prevValue.timeDifference + currentValue.timeDifference
      })
    )

    return totalTimeStats
  }

  async fetchHolidays(month: Date) {
    const firstDayOfFirstWeek = firstDayOfFirstWeekOfMonth(month)
    const lastDayOfLastWeek = lastDayOfLastWeekOfMonth(month)

    return await getHolidaysBetweenDate(firstDayOfFirstWeek, lastDayOfLastWeek)
  }

  async fetchActivities(month: Date) {
    const firstDayOfFirstWeek = firstDayOfFirstWeekOfMonth(month)
    const lastDayOfLastWeek = lastDayOfLastWeekOfMonth(month)

    const isThisMonthOrPrevious =
      DateTime.isThisMonth(month) || DateTime.isSameMonth(month, DateTime.subMonths(DateTime.now(), 1))

    const [activities, recentRoles] = await Promise.all([
      ActivitiesAPI.fetchAllBetweenDate(firstDayOfFirstWeek, lastDayOfLastWeek),
      isThisMonthOrPrevious ? getRecentRoles() : undefined
    ])

    return {
      activities,
      recentRoles
    }
  }
}

export const BinnacleResourcesService = new Resources()
