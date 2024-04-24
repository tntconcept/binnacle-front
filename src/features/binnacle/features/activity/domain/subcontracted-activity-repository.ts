import { DateInterval } from '../../../../../shared/types/date-interval'
import { Id } from '../../../../../shared/types/id'
import { NewSubcontractedActivity } from './new-subcontracted-activity'
// import { TimeSummary } from './time-summary'
import { UpdateSubcontractedActivity } from './update-subcontracted-activity'
import { GetSubcontractedActivitiesQueryParams } from './get-subcontracted-activities-query-params'
import { SubcontractedActivityWithProjectRoleId } from './subcontracted-activity-with-project-role-id'

export interface SubcontractedActivityRepository {
  getAll(
    { start, end }: DateInterval,
    userId: Id
  ): Promise<SubcontractedActivityWithProjectRoleId[]>

  getActivitiesBasedOnFilters(
    queryParams: GetSubcontractedActivitiesQueryParams
  ): Promise<SubcontractedActivityWithProjectRoleId[]>

  create(
    newSubcontractedActivity: NewSubcontractedActivity
  ): Promise<SubcontractedActivityWithProjectRoleId>

  update(
    updateSubcontractedActivity: UpdateSubcontractedActivity
  ): Promise<SubcontractedActivityWithProjectRoleId>

  delete(activityId: Id): Promise<void>

  // getTimeSummary(date: Date): Promise<TimeSummary>
}
