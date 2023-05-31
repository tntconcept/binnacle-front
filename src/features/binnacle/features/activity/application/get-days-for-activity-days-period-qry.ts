import { Query, UseCaseKey } from '@archimedes/arch'
import { ACTIVITY_REPOSITORY } from 'shared/di/container-tokens'
import { DateInterval } from 'shared/types/date-interval'
import { inject, singleton } from 'tsyringe'
import type { ActivityRepository } from '../domain/activity-repository'

@UseCaseKey('GetDaysForActivityDaysPeriodQry')
@singleton()
export class GetDaysForActivityDaysPeriodQry extends Query<number, DateInterval> {
  constructor(@inject(ACTIVITY_REPOSITORY) private activityRepository: ActivityRepository) {
    super()
  }

  internalExecute(interval: DateInterval): Promise<number> {
    return this.activityRepository.getDaysForActivityDaysPeriod(interval)
  }
}
