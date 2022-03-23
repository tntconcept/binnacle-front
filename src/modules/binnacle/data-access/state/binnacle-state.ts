import { action, makeObservable, observable } from 'mobx'
import type { ActivitiesPerDay } from 'modules/binnacle/data-access/interfaces/activities-per-day.interface'
import type { Holidays } from 'shared/types/Holidays'
import { singleton } from 'tsyringe'
import type { RecentRole } from '../interfaces/recent-role'
import type { SelectedWorkingTimeMode } from '../interfaces/selected-working-time-mode'
import type { WorkingTime } from '../interfaces/working-time.interface'

@singleton()
export class BinnacleState {
  @observable
  selectedDate: Date = new Date()

  @observable.ref
  holidays: Holidays = { holidays: [], vacations: [] }

  @observable
  selectedWorkingTimeMode: SelectedWorkingTimeMode = 'by-month'

  @observable.ref
  workingTime?: WorkingTime = undefined

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
