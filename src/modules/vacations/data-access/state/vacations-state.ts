import { makeObservable, observable } from 'mobx'
import type { VacationDetails } from 'modules/vacations/data-access/VacationDetails'
import type { Vacation } from 'shared/types/Vacation'
import { singleton } from 'tsyringe'
import chrono from 'shared/utils/chrono'

@singleton()
export class VacationsState {
  @observable
  selectedYear: number = chrono().get('year')

  @observable.ref
  vacationDetails?: VacationDetails = undefined

  @observable.ref
  vacations: Vacation[] = []

  constructor() {
    makeObservable(this)
  }
}
