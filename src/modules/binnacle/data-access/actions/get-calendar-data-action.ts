import { action, makeObservable, runInAction } from 'mobx'
import type { HolidaysRepository } from 'modules/binnacle/data-access/interfaces/holidays-repository'
import { BinnacleState } from 'modules/binnacle/data-access/state/binnacle-state'
import { firstDayOfFirstWeekOfMonth } from 'modules/binnacle/data-access/utils/firstDayOfFirstWeekOfMonth'
import { lastDayOfLastWeekOfMonth } from 'modules/binnacle/data-access/utils/lastDayOfLastWeekOfMonth'
import type { IAction } from 'shared/arch/interfaces/IAction'
import {
  ACTIVITY_REPOSITORY,
  HOLIDAYS_REPOSITORY
} from 'shared/data-access/ioc-container/ioc-container.tokens'
import { inject, singleton } from 'tsyringe'
import type { ActivityRepository } from '../interfaces/activity-repository'
import { GetTimeSummaryAction } from './get-time-summary-action'

@singleton()
export class GetCalendarDataAction implements IAction<Date> {
  constructor(
    @inject(ACTIVITY_REPOSITORY) private activityRepository: ActivityRepository,
    @inject(HOLIDAYS_REPOSITORY) private holidaysRepository: HolidaysRepository,
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

    const [{ holidays, vacations }, activities, recentRoles = [], activitiesDaySummary] =
      await Promise.all([
        this.holidaysRepository.getHolidays(firstDayOfFirstWeek, lastDayOfLastWeek),
        this.activityRepository.getActivitiesBetweenDate(firstDayOfFirstWeek, lastDayOfLastWeek),
        this.activityRepository.getRecentProjectRoles(),
        this.activityRepository.getActivitySummary(firstDayOfFirstWeek, lastDayOfLastWeek),
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
      this.binnacleState.activitiesDaySummary = activitiesDaySummary
    })
  }
}
