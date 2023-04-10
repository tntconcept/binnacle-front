import { ActivityWithProjectRoleId } from './activity-with-project-role-id'

export type NewActivity = Pick<
  ActivityWithProjectRoleId,
  'description' | 'billable' | 'interval' | 'projectRoleId'
>
