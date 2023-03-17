import { Activity } from './activity.interface'

export type ActivityWithProjectRoleId = Omit<
  Activity,
  'organization' | 'project' | 'projectRole'
> & {
  projectRoleId: number
}
