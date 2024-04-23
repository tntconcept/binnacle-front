import { Command, UseCaseKey } from '@archimedes/arch'
import { SUBCONTRACTED_ACTIVITY_REPOSITORY } from '../../../../../shared/di/container-tokens'
import { inject, singleton } from 'tsyringe'
import { UpdateSubcontractedActivity } from '../domain/update-subcontracted-activity'
import type { SubcontractedActivityRepository } from '../domain/subcontracted-activity-repository'

@UseCaseKey('UpdateSubcontractedActivityCmd')
@singleton()
export class UpdateSubcontractedActivityCmd extends Command<UpdateSubcontractedActivity> {
  constructor(
    @inject(SUBCONTRACTED_ACTIVITY_REPOSITORY)
    private subcontractedActivityRepository: SubcontractedActivityRepository
  ) {
    super()
  }

  async internalExecute(activity: UpdateSubcontractedActivity): Promise<void> {
    await this.subcontractedActivityRepository.update(activity)
  }
}
