import { Id } from '../../../../../shared/types/id'
import { SubcontractedActivity } from './subcontracted-activity'

export type SubcontractedActivityWithProjectRoleId = Omit<
  SubcontractedActivity,
  'organization' | 'project' | 'projectRole'
> & {
  projectRoleId: Id
}

/*
import { Id } from '../../../../../shared/types/id'
import { Activity } from './activity'

export type ActivityWithProjectRoleId = Omit<
  Activity,
  'organization' | 'project' | 'projectRole'
> & {
  projectRoleId: Id
}
*/
