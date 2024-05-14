import { SubcontractedActivityWithProjectRoleId } from '../domain/subcontracted-activity-with-project-role-id'

export type SubcontractedActivityWithProjectRoleIdDto = Omit<
  SubcontractedActivityWithProjectRoleId,
  'interval'
>
