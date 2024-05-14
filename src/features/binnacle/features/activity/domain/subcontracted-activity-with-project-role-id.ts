import { Id } from '../../../../../shared/types/id'
import { SubcontractedActivity } from './subcontracted-activity'

export type SubcontractedActivityWithProjectRoleId = Omit<
  SubcontractedActivity,
  'organization' | 'project' | 'projectRole'
> & {
  projectRoleId: Id
}
