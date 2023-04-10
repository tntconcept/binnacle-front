import { ActivityWithProjectRoleId } from './activity-with-project-role-id'

export type UpdateActivity = Pick<
  ActivityWithProjectRoleId,
  'id' | 'description' | 'billable' | 'interval' | 'projectRoleId'
>
