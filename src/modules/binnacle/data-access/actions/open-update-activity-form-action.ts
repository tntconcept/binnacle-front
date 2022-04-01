import { action, makeObservable } from 'mobx'
import type { Activity } from 'modules/binnacle/data-access/interfaces/activity.interface'
import { ActivityFormState } from 'modules/binnacle/data-access/state/activity-form-state'
import { singleton } from 'tsyringe'
import type { IAction } from 'shared/arch/interfaces/IAction'

@singleton()
export class OpenUpdateActivityFormAction implements IAction<Activity> {
  constructor(private activityFormState: ActivityFormState) {
    makeObservable(this)
  }

  @action
  async execute(activity: Activity): Promise<void> {
    this.activityFormState.activity = activity
    this.activityFormState.selectedActivityDate = activity.startDate
    this.activityFormState.lastEndTime = undefined

    this.activityFormState.isModalOpen = true
  }
}
