import { Query, UseCaseKey } from '@archimedes/arch'
import { ACTIVITY_REPOSITORY } from '../../../../../shared/di/container-tokens'
import { DateInterval } from '../../../../../shared/types/date-interval'
import { inject, singleton } from 'tsyringe'
import type { ActivityRepository } from '../domain/activity-repository'
import { Id } from '../../../../../shared/types/id'

type Params = { roleId: Id; interval: DateInterval }

@UseCaseKey('GetDaysForActivityNaturalDaysPeriodQry')
@singleton()
export class GetDaysForActivityNaturalDaysPeriodQry extends Query<number, Params> {
  constructor(@inject(ACTIVITY_REPOSITORY) private activityRepository: ActivityRepository) {
    super()
  }

  internalExecute({ interval, roleId }: Params): Promise<number> {
    return this.activityRepository.getDaysForActivityNaturalDaysPeriod(roleId, interval)
  }
}
