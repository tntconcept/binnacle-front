import { Command, UseCaseKey } from '@archimedes/arch'
import { SUBCONTRACTED_ACTIVITY_REPOSITORY } from '../../../../../shared/di/container-tokens'
import { inject, singleton } from 'tsyringe'
import { NewSubcontractedActivity } from '../domain/new-subcontracted-activity'
import type { SubcontractedActivityRepository } from '../domain/subcontracted-activity-repository'

@UseCaseKey('CreateSubcontractedActivityCmd')
@singleton()
export class CreateSubcontractedActivityCmd extends Command<NewSubcontractedActivity> {
  constructor(
    @inject(SUBCONTRACTED_ACTIVITY_REPOSITORY)
    private subcontractedActivityRepository: SubcontractedActivityRepository
  ) {
    super()
  }
  async internalExecute(newActivity: NewSubcontractedActivity): Promise<void> {
    await this.subcontractedActivityRepository.create(newActivity)
  }
}
