import { action, makeObservable, runInAction } from 'mobx'
import type { HolidaysRepository } from 'modules/binnacle/data-access/interfaces/holidays-repository'
import { BinnacleState } from 'modules/binnacle/data-access/state/binnacle-state'
import { firstDayOfFirstWeekOfMonth } from 'modules/binnacle/data-access/utils/firstDayOfFirstWeekOfMonth'
import { lastDayOfLastWeekOfMonth } from 'modules/binnacle/data-access/utils/lastDayOfLastWeekOfMonth'
import type { IAction } from 'shared/arch/interfaces/IAction'
import {
  ACTIVITY_REPOSITORY,
  HOLIDAYS_REPOSITORY,
  SEARCH_REPOSITORY
} from 'shared/data-access/ioc-container/ioc-container.tokens'
import { inject, singleton } from 'tsyringe'
import type { ActivityRepository } from '../interfaces/activity-repository'
import type { SearchRepository } from '../interfaces/search-repository'
import { ActivitiesWithRoleInformation } from '../services/activities-with-role-information'
import { GetTimeSummaryAction } from './get-time-summary-action'

@singleton()
export class GetCalendarDataAction implements IAction<Date> {
  constructor(
    @inject(ACTIVITY_REPOSITORY) private activityRepository: ActivityRepository,
    @inject(HOLIDAYS_REPOSITORY) private holidaysRepository: HolidaysRepository,
    @inject(SEARCH_REPOSITORY) private searchRepository: SearchRepository,
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

    const [
      { holidays, vacations },
      activitiesWithProjectRoleId,
      recentRoles = [],
      activitiesDaySummary
    ] = await Promise.all([
      this.holidaysRepository.getHolidays(firstDayOfFirstWeek, lastDayOfLastWeek),
      this.activityRepository.getActivities(firstDayOfFirstWeek, lastDayOfLastWeek),
      this.activityRepository.getRecentProjectRoles(),
      this.activityRepository.getActivitySummary(firstDayOfFirstWeek, lastDayOfLastWeek),
      await this.getTimeSummaryAction.execute(selectedMonth, yearChanged)
    ])

    const roleIds = activitiesWithProjectRoleId.flatMap((m) => m.projectRoleId)
    const uniqueRoleIds = Array.from(new Set(roleIds))
    const rolesInformation = await this.searchRepository.roles(uniqueRoleIds)
    const activities = ActivitiesWithRoleInformation.addRoleInformationToActivities(
      activitiesWithProjectRoleId,
      rolesInformation
    )

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
