import { Query, UseCaseKey } from '@archimedes/arch'
import { ACTIVITY_REPOSITORY } from '../../../../../shared/di/container-tokens'
import { DateInterval } from '../../../../../shared/types/date-interval'
import { singleton, inject } from 'tsyringe'
import { ActivityDaySummary } from '../domain/activity-day-summary'
import type { ActivityRepository } from '../domain/activity-repository'

@UseCaseKey('GetActivitySummaryQry')
@singleton()
export class GetActivitySummaryQry extends Query<ActivityDaySummary[], DateInterval> {
  constructor(@inject(ACTIVITY_REPOSITORY) private activityRepository: ActivityRepository) {
    super()
  }

  internalExecute(interval: DateInterval): Promise<ActivityDaySummary[]> {
    return this.activityRepository.getActivitySummary(interval)
  }
}
