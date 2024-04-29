import { SubcontractedActivityWithProjectRoleId } from './subcontracted-activity-with-project-role-id'

export type NewSubcontractedActivity = Pick<
  SubcontractedActivityWithProjectRoleId,
  'description' | 'projectRoleId' | 'duration' | 'month'
>
