import { Command, UseCaseKey } from '@archimedes/arch'
import { SUBCONTRACTED_ACTIVITY_REPOSITORY } from '../../../../../shared/di/container-tokens'
import { inject, singleton } from 'tsyringe'
import { NewSubcontractedActivity } from '../domain/new-subcontracted-activity'
import type { SubcontractedActivityRepository } from '../domain/subcontracted-activity-repository'
//import { ACTIVITY_REPOSITORY } from '../../../../../shared/di/container-tokens'
//import type { ActivityRepository } from '../domain/activity-repository'
//import { NewActivity } from '../domain/new-activity'

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

/*import { Command, UseCaseKey } from '@archimedes/arch'
import { ACTIVITY_REPOSITORY } from '../../../../../shared/di/container-tokens'
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
*/
