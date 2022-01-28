import { action, makeObservable, observable } from 'mobx'
import type { ActivitiesPerDay } from 'modules/binnacle/data-access/interfaces/activities-per-day.interface'
import type { Holidays } from 'shared/types/Holidays'
import { singleton } from 'tsyringe'
import type { RecentRole } from '../interfaces/recent-role'
import type { TimeBalance } from '../interfaces/time-balance.interface'

@singleton()
export class BinnacleState {
  @observable
  selectedDate: Date = new Date()

  @observable.ref
  holidays: Holidays = { holidays: [], vacations: [] }

  @observable
  selectedTimeBalanceMode: 'by-year' | 'by-month' = 'by-month'

  @observable.ref
  timeBalance?: TimeBalance = undefined

  @observable.ref
  activities: ActivitiesPerDay[] = []

  @observable.ref
  recentRoles: RecentRole[] = []

  constructor() {
    makeObservable(this)
  }

  @action.bound
  changeSelectedDate(date: Date) {
    this.selectedDate = date
  }
}
