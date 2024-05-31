import { SubcontractedActivityWithProjectRoleId } from './subcontracted-activity-with-project-role-id'

export type NewSubcontractedActivity = Pick<
  SubcontractedActivityWithProjectRoleId,
  'description' | 'billable' | 'projectRoleId' | 'duration' | 'month'
>
