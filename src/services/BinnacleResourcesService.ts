import { firstDayOfFirstWeekOfMonth, lastDayOfLastWeekOfMonth } from 'utils/DateUtils'
import { fetchHolidaysBetweenDate } from 'api/HolidaysAPI'
import { fetchTimeBalanceBetweenDate } from 'api/TimeBalanceAPI'
import { fetchActivitiesBetweenDate } from 'api/ActivitiesAPI'
import { fetchRecentRoles } from 'api/RoleAPI'
import { IHolidays, VacationState } from 'api/interfaces/IHolidays'
import { ITimeBalance } from 'api/interfaces/ITimeBalance'
import chrono from 'services/Chrono'

const buildTimeBalanceKey = (month: Date) => {
  const monthNumber = ('0' + (month.getMonth() + 1).toString()).slice(-2)
  return month.getFullYear() + '-' + monthNumber + '-01'
}

class BinnacleService {
  fetchTimeBalance = async (month: Date, mode: 'by_month' | 'by_year') => {
    const promise =
      mode === 'by_month' ? this.fetchTimeDataByMonth(month) : this.fetchTimeDataByYear(month)

    return await promise
  }

  async fetchTimeDataByMonth(month: Date): Promise<ITimeBalance> {
    const startDate = chrono(month)
      .startOf('month')
      .getDate()
    const endDate = chrono(month)
      .endOf('month')
      .getDate()

    const data = await fetchTimeBalanceBetweenDate(startDate, endDate)

    return data[buildTimeBalanceKey(month)]
  }

  async fetchTimeDataByYear(month: Date) {
    const startOfYear = chrono(month)
      .startOf('year')
      .getDate()
    const endOfMonth = chrono(month)
      .endOf('month')
      .getDate()

    const response = await fetchTimeBalanceBetweenDate(startOfYear, endOfMonth)

    const onlySelectedYear = Object.fromEntries(
      Object.entries(response).filter(([key]) => key.includes(month.getFullYear().toString()))
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
        chrono(new Date())
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
