import { Id } from '../../../../../shared/types/id'
import { NewSubcontractedActivity } from './new-subcontracted-activity'
import { UpdateSubcontractedActivity } from './update-subcontracted-activity'
import { GetSubcontractedActivitiesQueryParams } from './get-subcontracted-activities-query-params'
import { SubcontractedActivityWithProjectRoleId } from './subcontracted-activity-with-project-role-id'

export interface SubcontractedActivityRepository {
  getAll(
    queryParams: GetSubcontractedActivitiesQueryParams
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
}
