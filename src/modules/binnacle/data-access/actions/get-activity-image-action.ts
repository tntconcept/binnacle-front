import { action, makeObservable, runInAction } from 'mobx'
import { inject, singleton } from 'tsyringe'
import { IAction } from '../../../../shared/arch/interfaces/IAction'
import { ActivityFormState } from '../state/activity-form-state'
import type { ActivityRepository } from '../interfaces/activity-repository'
import { ACTIVITY_REPOSITORY } from 'shared/data-access/ioc-container/ioc-container.tokens'

@singleton()
export class GetActivityImageAction implements IAction<number> {
  constructor(
    @inject(ACTIVITY_REPOSITORY) private activityRepository: ActivityRepository,
    private activityFormState: ActivityFormState
  ) {
    makeObservable(this)
  }

  @action
  async execute(activityId?: number): Promise<void> {
    const response = activityId ? await this.activityRepository.getActivityImage(activityId) : null

    runInAction(() => {
      this.activityFormState.initialImageFile = response
    })
  }
}
