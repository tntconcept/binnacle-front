import { DateInterval } from '../../../../../shared/types/date-interval'
import { Id } from '../../../../../shared/types/id'
import { NewSubcontractedActivity } from './new-subcontracted-activity'
import { TimeSummary } from './time-summary'
import { UpdateSubcontractedActivity } from './update-subcontracted-activity'
import { GetActivitiesQueryParams } from './get-activities-query-params'
import { SubcontractedActivityWithProjectRoleId } from './subcontracted-activity-with-project-role-id'

export interface SubcontractedActivityRepository {
  getAll(
    { start, end }: DateInterval,
    userId: Id
  ): Promise<SubcontractedActivityWithProjectRoleId[]>

  getActivitiesBasedOnFilters(
    queryParams: GetActivitiesQueryParams
  ): Promise<SubcontractedActivityWithProjectRoleId[]>

  //getActivityEvidence(activityId: Id): Promise<File>

  create(
    newSubcontractedActivity: NewSubcontractedActivity
  ): Promise<SubcontractedActivityWithProjectRoleId>

  update(activity: UpdateSubcontractedActivity): Promise<SubcontractedActivityWithProjectRoleId>

  delete(activityId: Id): Promise<void>

  getTimeSummary(date: Date): Promise<TimeSummary>

  approve(activityId: Id): Promise<void>
}
