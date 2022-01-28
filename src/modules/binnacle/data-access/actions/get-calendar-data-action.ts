import { action, makeObservable, runInAction } from 'mobx'
import { GetTimeBalanceByMonthAction } from 'modules/binnacle/data-access/actions/get-time-balance-by-month-action'
import { GetTimeBalanceByYearAction } from 'modules/binnacle/data-access/actions/get-time-balance-by-year-action'
import { ActivitiesRepository } from 'modules/binnacle/data-access/repositories/activities-repository'
import { HolidaysRepository } from 'modules/binnacle/data-access/repositories/holidays-repository'
import { BinnacleState } from 'modules/binnacle/data-access/state/binnacle-state'
import { firstDayOfFirstWeekOfMonth } from 'modules/binnacle/data-access/utils/firstDayOfFirstWeekOfMonth'
import { lastDayOfLastWeekOfMonth } from 'modules/binnacle/data-access/utils/lastDayOfLastWeekOfMonth'
import chrono from 'shared/utils/chrono'
import { singleton } from 'tsyringe'
import type { IAction } from 'shared/arch/interfaces/IAction'

@singleton()
export class GetCalendarDataAction implements IAction<Date> {
  constructor(
    private activitiesRepository: ActivitiesRepository,
    private holidaysRepository: HolidaysRepository,
    private binnacleState: BinnacleState,
    private getTimeBalanceByMonthAction: GetTimeBalanceByMonthAction,
    private getTimeBalanceByYearAction: GetTimeBalanceByYearAction
  ) {
    makeObservable(this)
  }

  @action
  async execute(selectedMonth?: Date): Promise<void> {
    const month = selectedMonth ? selectedMonth : this.binnacleState.selectedDate
    const firstDayOfFirstWeek = firstDayOfFirstWeekOfMonth(month)
    const lastDayOfLastWeek = lastDayOfLastWeekOfMonth(month)

    const [{ holidays, vacations }, activities, recentRoles = []] = await Promise.all([
      this.holidaysRepository.getHolidays(firstDayOfFirstWeek, lastDayOfLastWeek),
      this.activitiesRepository.getActivitiesBetweenDate(firstDayOfFirstWeek, lastDayOfLastWeek),
      this.isThisMonthOrPrevious(month) ? this.activitiesRepository.getRecentProjectRoles() : undefined,
      this.binnacleState.selectedTimeBalanceMode === 'by-month'
        ? this.getTimeBalanceByMonthAction.execute(month)
        : this.getTimeBalanceByYearAction.execute(month)
    ])

    runInAction(() => {
      this.binnacleState.selectedDate = month
      this.binnacleState.holidays = {
        holidays: holidays,
        vacations: vacations.filter((vacation) => vacation.state === 'ACCEPT')
      }
      this.binnacleState.activities = activities
      this.binnacleState.recentRoles = recentRoles
    })
  }

  private isThisMonthOrPrevious(month: Date) {
    if (chrono(month).isSame(new Date(), 'year')) {
      const previousMonth = chrono()
        .minus(1, 'month')
        .getDate()
      return chrono(month).isSame(new Date(), 'month') || chrono(month).isSame(previousMonth, 'month')
    }

    return false
  }
}
