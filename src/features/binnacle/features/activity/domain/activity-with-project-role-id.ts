import { Id } from '../../../../../shared/types/id'
import { Activity } from './activity'

export type ActivityWithProjectRoleId = Omit<
  Activity,
  'organization' | 'project' | 'projectRole'
> & {
  projectRoleId: Id
}
