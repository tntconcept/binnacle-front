import { SubcontractedActivityWithProjectRoleId } from './subcontracted-activity-with-project-role-id'

export type UpdateSubcontractedActivity = Pick<
  SubcontractedActivityWithProjectRoleId,
  'id' | 'description' | 'billable' | 'projectRoleId' | 'duration' | 'month'
>
