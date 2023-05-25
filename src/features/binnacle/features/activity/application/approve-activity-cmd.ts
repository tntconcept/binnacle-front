import { Command, Id, UseCaseKey } from '@archimedes/arch'
import { ACTIVITY_REPOSITORY } from 'shared/di/container-tokens'
import { inject, singleton } from 'tsyringe'
import type { ActivityRepository } from '../domain/activity-repository'

@UseCaseKey('ApproveActivityCmd')
@singleton()
export class ApproveActivityCmd extends Command<Id> {
  constructor(@inject(ACTIVITY_REPOSITORY) private activityRepository: ActivityRepository) {
    super()
  }
  async internalExecute(id: Id): Promise<void> {
    await this.activityRepository.setApproved(id)
  }
}
