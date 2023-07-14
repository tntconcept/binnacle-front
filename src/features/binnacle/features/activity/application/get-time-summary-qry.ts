import { Query, UseCaseKey } from '@archimedes/arch'
import { ACTIVITY_REPOSITORY } from '../../../../../shared/di/container-tokens'
import { singleton, inject } from 'tsyringe'
import type { ActivityRepository } from '../domain/activity-repository'
import { TimeSummary } from '../domain/time-summary'

@UseCaseKey('GetTimeSummaryQry')
@singleton()
export class GetTimeSummaryQry extends Query<TimeSummary, Date> {
  constructor(@inject(ACTIVITY_REPOSITORY) private activityRepository: ActivityRepository) {
    super()
  }

  internalExecute(date: Date): Promise<TimeSummary> {
    return this.activityRepository.getTimeSummary(date)
  }
}
