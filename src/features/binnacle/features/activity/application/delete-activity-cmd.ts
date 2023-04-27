import { Command, UseCaseKey } from '@archimedes/arch'
import { ACTIVITY_REPOSITORY } from 'shared/di/container-tokens'
import { Id } from 'shared/types/id'
import { inject, singleton } from 'tsyringe'
import type { ActivityRepository } from '../domain/activity-repository'

@UseCaseKey('DeleteActivityCmd')
@singleton()
export class DeleteActivityCmd extends Command<Id> {
  constructor(@inject(ACTIVITY_REPOSITORY) private activityRepository: ActivityRepository) {
    super()
  }

  async internalExecute(id: Id): Promise<void> {
    // TODO: review error handle of getActivityHttpErrorMessage
    await this.activityRepository.delete(id)
  }
}
