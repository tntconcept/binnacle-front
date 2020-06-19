import { endOfMonth, startOfMonth, startOfYear } from 'date-fns'
import {
  firstDayOfFirstWeekOfMonth,
  lastDayOfLastWeekOfMonth
} from 'utils/DateUtils'
import DateTime from 'services/DateTime'
import { fetchHolidaysBetweenDate } from 'api/HolidaysAPI'
import { fetchTimeBalanceBetweenDate } from 'api/TimeBalanceAPI'
import { fetchActivitiesBetweenDate } from 'api/ActivitiesAPI'
import { fetchRecentRoles } from 'api/RoleAPI'

const buildTimeBalanceKey = (month: Date) => {
  const monthNumber = ('0' + (month.getMonth() + 1).toString()).slice(-2)
  return month.getFullYear() + '-' + monthNumber + '-01'
}

class BinnacleService {
  fetchTimeBalance = async (month: Date, mode: 'by_month' | 'by_year') => {
    const promise =
      mode === 'by_month'
        ? this.fetchTimeDataByMonth(month)
        : this.fetchTimeDataByYear(month)

    return await promise
  }

  async fetchTimeDataByMonth(month: Date) {
    const startDate = startOfMonth(month)
    const endDate = endOfMonth(month)

    const data = await fetchTimeBalanceBetweenDate(startDate, endDate)

    return data[buildTimeBalanceKey(month)]
  }

  async fetchTimeDataByYear(month: Date) {
    const response = await fetchTimeBalanceBetweenDate(
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

    return await fetchHolidaysBetweenDate(firstDayOfFirstWeek, lastDayOfLastWeek)
  }

  async fetchActivities(month: Date) {
    const firstDayOfFirstWeek = firstDayOfFirstWeekOfMonth(month)
    const lastDayOfLastWeek = lastDayOfLastWeekOfMonth(month)

    const isThisMonthOrPrevious =
      DateTime.isThisMonth(month) ||
      DateTime.isSameMonth(month, DateTime.subMonths(DateTime.now(), 1))

    const [activities, recentRoles] = await Promise.all([
      fetchActivitiesBetweenDate(firstDayOfFirstWeek, lastDayOfLastWeek),
      isThisMonthOrPrevious ? fetchRecentRoles() : undefined
    ])

    return {
      activities,
      recentRoles
    }
  }
}

export const BinnacleResourcesService = new BinnacleService()
