import { action, makeObservable, runInAction } from 'mobx'
import { HolidaysRepository } from 'modules/binnacle/data-access/repositories/holidays-repository'
import { BinnacleState } from 'modules/binnacle/data-access/state/binnacle-state'
import { firstDayOfFirstWeekOfMonth } from 'modules/binnacle/data-access/utils/firstDayOfFirstWeekOfMonth'
import { lastDayOfLastWeekOfMonth } from 'modules/binnacle/data-access/utils/lastDayOfLastWeekOfMonth'
import { inject, singleton } from 'tsyringe'
import type { IAction } from 'shared/arch/interfaces/IAction'
import { GetTimeSummaryAction } from './get-time-summary-action'
import { ACTIVITY_REPOSITORY } from 'shared/data-access/ioc-container/ioc-container.tokens'
import type { ActivityRepository } from '../interfaces/activity-repository'

@singleton()
export class GetCalendarDataAction implements IAction<Date> {
  constructor(
    @inject(ACTIVITY_REPOSITORY) private activityRepository: ActivityRepository,
    private holidaysRepository: HolidaysRepository,
    private binnacleState: BinnacleState,
    private getTimeSummaryAction: GetTimeSummaryAction
  ) {
    makeObservable(this)
  }

  @action
  async execute(selectedMonth?: Date): Promise<void> {
    const month = selectedMonth ? selectedMonth : this.binnacleState.selectedDate
    const firstDayOfFirstWeek = firstDayOfFirstWeekOfMonth(month)
    const lastDayOfLastWeek = lastDayOfLastWeekOfMonth(month)
    const yearChanged = month.getFullYear() !== this.binnacleState.selectedDate.getFullYear()

    const [{ holidays, vacations }, activities, recentRoles = []] = await Promise.all([
      this.holidaysRepository.getHolidays(firstDayOfFirstWeek, lastDayOfLastWeek),
      this.activityRepository.getActivitiesBetweenDate(firstDayOfFirstWeek, lastDayOfLastWeek),
      this.activityRepository.getRecentProjectRoles(),
      await this.getTimeSummaryAction.execute(selectedMonth, yearChanged)
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
}
