import { Query, UseCaseKey } from '@archimedes/arch'
import { ACTIVITY_REPOSITORY } from 'shared/di/container-tokens'
import { inject, singleton } from 'tsyringe'
import type { ActivityRepository } from '../domain/activity-repository'
import { Id } from 'shared/types/id'

interface RoleIdYear {
  roleId: Id
  date: Date
}

@UseCaseKey('GetActivityRegisteredTimeQry')
@singleton()
export class GetActivityRegisteredTimeQry extends Query<number, RoleIdYear> {
  constructor(@inject(ACTIVITY_REPOSITORY) private activityRepository: ActivityRepository) {
    super()
  }

  internalExecute({ roleId, date }: RoleIdYear): Promise<number> {
    return this.activityRepository.getActivityRegisteredTimeQry(roleId, date)
  }
}
