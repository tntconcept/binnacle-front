import { action, makeObservable, observable } from 'mobx'
import type { Activity } from 'modules/binnacle/data-access/interfaces/activity.interface'
import { singleton } from 'tsyringe'

@singleton()
export class ActivityFormState {
  @observable
  isModalOpen = false

  @observable
  selectedActivityDate: Date = new Date()

  @observable
  lastEndTime?: Date = undefined

  @observable.ref
  activity?: Activity = undefined

  @observable.ref
  initialImageFile: string | null = null

  constructor() {
    makeObservable(this)
  }

  @action.bound
  changeSelectedActivityDate(date: Date) {
    this.selectedActivityDate = date
  }

  @action.bound
  closeModal() {
    this.isModalOpen = false
  }
}
