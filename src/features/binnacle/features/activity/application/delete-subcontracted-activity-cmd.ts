import { Command, UseCaseKey } from '@archimedes/arch'
import { SUBCONTRACTED_ACTIVITY_REPOSITORY } from '../../../../../shared/di/container-tokens'
import { Id } from '../../../../../shared/types/id'
import { inject, singleton } from 'tsyringe'
import type { SubcontractedActivityRepository } from '../domain/subcontracted-activity-repository'

@UseCaseKey('DeleteSubcontractedActivityCmd')
@singleton()
export class DeleteSubcontractedActivityCmd extends Command<Id> {
  constructor(
    @inject(SUBCONTRACTED_ACTIVITY_REPOSITORY)
    private subcontractedActivityRepository: SubcontractedActivityRepository
  ) {
    super()
  }

  async internalExecute(id: Id): Promise<void> {
    await this.subcontractedActivityRepository.delete(id)
  }
}
