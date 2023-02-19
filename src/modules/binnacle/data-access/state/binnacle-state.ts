import { action, makeObservable, observable } from 'mobx'
import type { ActivitiesPerDay } from 'modules/binnacle/data-access/interfaces/activities-per-day.interface'
import type { Holidays } from 'shared/types/Holidays'
import { singleton } from 'tsyringe'
import type { RecentRole } from '../interfaces/recent-role'
import type { SelectedWorkingTimeMode } from '../interfaces/selected-working-time-mode'
import type { TimeSummary } from '../interfaces/time-summary.interface'
import type { YearBalance } from '../interfaces/year-balance.interface'

@singleton()
export class BinnacleState {
  @observable
  selectedDate: Date = new Date()

  @observable.ref
  holidays: Holidays = { holidays: [], vacations: [] }

  @observable
  selectedWorkingTimeMode: SelectedWorkingTimeMode = 'by-month'

  @observable.ref
  timeSummary?: TimeSummary = undefined

  @observable.ref
  activities: ActivitiesPerDay[] = []

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
