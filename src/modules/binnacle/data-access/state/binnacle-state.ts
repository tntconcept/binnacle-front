import { action, makeObservable, observable } from 'mobx'
import type { Holidays } from 'shared/types/Holidays'
import { singleton } from 'tsyringe'
import { ActivityDaySummary } from '../interfaces/activity-day-summary'
import { Activity } from '../interfaces/activity.interface'
import type { RecentRole } from '../interfaces/recent-role'
import type { SelectedTimeSummaryMode } from '../interfaces/selected-time-summary-mode'
import type { TimeSummary } from '../interfaces/time-summary.interface'
import type { YearBalance } from '../interfaces/year-balance.interface'

@singleton()
export class BinnacleState {
  @observable
  selectedDate: Date = new Date()

  @observable.ref
  holidays: Holidays = { holidays: [], vacations: [] }

  @observable
  selectedTimeSummaryMode: SelectedTimeSummaryMode = 'by-month'

  @observable.ref
  timeSummary?: TimeSummary = undefined

  @observable.ref
  activities: Activity[] = []

  @observable.ref
  activitiesDaySummary: ActivityDaySummary[] = []

  @observable.ref
  recentRoles: RecentRole[] = []

  @observable.ref
  yearBalance?: YearBalance = undefined

  constructor() {
    makeObservable(this)
  }

  @action.bound
  changeSelectedDate(date: Date) {
    this.selectedDate = date
  }
}
