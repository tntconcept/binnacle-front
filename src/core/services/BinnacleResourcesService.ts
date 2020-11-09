import { fetchHolidaysBetweenDate } from 'core/api/holidays'
import { fetchTimeBalanceBetweenDate } from 'core/api/timeBalance'
import { fetchActivitiesBetweenDate } from 'core/api/activities'
import { fetchRecentRoles } from 'core/api/projectRoles'
import { IHolidays, VacationState } from 'core/api/interfaces'
import { ITimeBalance } from 'core/api/interfaces'
import chrono from 'core/services/Chrono'
import {
  firstDayOfFirstWeekOfMonth,
  lastDayOfLastWeekOfMonth
} from 'pages/binnacle/BinnaclePage.utils'

const buildTimeBalanceKey = (month: Date) => {
  const monthNumber = ('0' + (month.getMonth() + 1).toString()).slice(-2)
  return month.getFullYear() + '-' + monthNumber + '-01'
}

class BinnacleService {
  fetchTimeBalance = async (month: Date, mode: 'by_month' | 'by_year', userHiringDate: Date) => {
    const hiredSameMonth = chrono(userHiringDate).isSame(month, 'month')
    const hiredSameYear = chrono(userHiringDate).isSame(month, 'year')

    const startDate = chrono(month)
      .startOf(mode === 'by_month' ? 'month' : 'year')
      .getDate()
    const endDate = chrono(month)
      .endOf('month')
      .getDate()

    const promise =
      mode === 'by_month'
        ? this.fetchTimeDataByMonth(
            hiredSameMonth ? chrono(userHiringDate).getDate() : startDate,
            endDate
          )
        : this.fetchTimeDataByYear(
            hiredSameYear ? chrono(userHiringDate).getDate() : startDate,
            endDate
          )

    return await promise
  }

  async fetchTimeDataByMonth(startDate: Date, endDate: Date): Promise<ITimeBalance> {
    const data = await fetchTimeBalanceBetweenDate(startDate, endDate)

    return data[buildTimeBalanceKey(startDate)]
  }

  async fetchTimeDataByYear(startDate: Date, endDate: Date) {
    const response = await fetchTimeBalanceBetweenDate(startDate, endDate)

    const onlySelectedYear = Object.fromEntries(
      Object.entries(response).filter(([key]) => key.includes(startDate.getFullYear().toString()))
    )

    const totalTimeStats = Object.values(onlySelectedYear).reduce((prevValue, currentValue) => ({
      timeWorked: prevValue.timeWorked + currentValue.timeWorked,
      timeToWork: prevValue.timeToWork + currentValue.timeToWork,
      timeDifference: prevValue.timeDifference + currentValue.timeDifference
    }))

    return totalTimeStats
  }

  async fetchHolidays(month: Date): Promise<IHolidays> {
    const firstDayOfFirstWeek = firstDayOfFirstWeekOfMonth(month)
    const lastDayOfLastWeek = lastDayOfLastWeekOfMonth(month)

    const response = await fetchHolidaysBetweenDate(firstDayOfFirstWeek, lastDayOfLastWeek)

    return {
      ...response,
      vacations: response.vacations.filter((holiday) => holiday.state === VacationState.Accept)
    }
  }

  async fetchActivities(month: Date) {
    const firstDayOfFirstWeek = firstDayOfFirstWeekOfMonth(month)
    const lastDayOfLastWeek = lastDayOfLastWeekOfMonth(month)

    const isThisMonthOrPrevious =
      chrono(month).isThisMonth() ||
      chrono(month).isSame(
        chrono(chrono.now())
          .minus(1, 'month')
          .getDate()
      )

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
