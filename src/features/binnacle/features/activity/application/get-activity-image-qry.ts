import { Query, UseCaseKey } from '@archimedes/arch'
import { ACTIVITY_REPOSITORY } from '../../../../../shared/di/container-tokens'
import { Id } from '../../../../../shared/types/id'
import { inject, singleton } from 'tsyringe'
import type { ActivityRepository } from '../domain/activity-repository'

@UseCaseKey('GetActivityEvidenceQry')
@singleton()
export class GetActivityEvidenceQry extends Query<File, Id> {
  constructor(@inject(ACTIVITY_REPOSITORY) private activityRepository: ActivityRepository) {
    super()
  }

  async internalExecute(id: Id): Promise<File> {
    return this.activityRepository.getActivityEvidence(id)
  }
}
