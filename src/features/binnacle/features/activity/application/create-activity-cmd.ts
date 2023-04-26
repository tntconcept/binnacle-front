import { Command, UseCaseKey } from '@archimedes/arch'
import { ACTIVITY_REPOSITORY } from 'shared/di/container-tokens'
import { inject, singleton } from 'tsyringe'
import type { ActivityRepository } from '../domain/activity-repository'
import { NewActivity } from '../domain/new-activity'

@UseCaseKey('CreateActivityCmd')
@singleton()
export class CreateActivityCmd extends Command<NewActivity> {
  constructor(@inject(ACTIVITY_REPOSITORY) private activityRepository: ActivityRepository) {
    super()
  }
  async internalExecute(newActivity: NewActivity): Promise<void> {
    await this.activityRepository.create(newActivity)
  }
}
