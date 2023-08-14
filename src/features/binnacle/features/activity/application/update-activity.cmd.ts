import { Command, UseCaseKey } from '@archimedes/arch'
import { ACTIVITY_REPOSITORY } from '../../../../../shared/di/container-tokens'
import { inject, singleton } from 'tsyringe'
import type { ActivityRepository } from '../domain/activity-repository'
import { UpdateActivity } from '../domain/update-activity'

@UseCaseKey('UpdateActivityCmd')
@singleton()
export class UpdateActivityCmd extends Command<UpdateActivity> {
  constructor(@inject(ACTIVITY_REPOSITORY) private activityRepository: ActivityRepository) {
    super()
  }

  async internalExecute(activity: UpdateActivity): Promise<void> {
    await this.activityRepository.update(activity)
  }
}
