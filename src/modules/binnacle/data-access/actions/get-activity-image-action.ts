import { ActivitiesRepository } from '../repositories/activities-repository'
import { action, makeObservable, runInAction } from 'mobx'
import { singleton } from 'tsyringe'
import { IAction } from '../../../../shared/arch/interfaces/IAction'
import { ActivityFormState } from '../state/activity-form-state'

@singleton()
export class GetActivityImageAction implements IAction<number> {
  constructor(
    private activitiesRepository: ActivitiesRepository,
    private activityFormState: ActivityFormState
  ) {
    makeObservable(this)
  }

  @action
  async execute(activityId?: number): Promise<void> {
    const response = activityId
      ? await this.activitiesRepository.getActivityImage(activityId)
      : null

    runInAction(() => {
      this.activityFormState.initialImageFile = response
    })
  }
}
