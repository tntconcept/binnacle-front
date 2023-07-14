import { DateInterval } from '../../../../../shared/types/date-interval'
import { ActivityWithProjectRoleId } from './activity-with-project-role-id'

export type UpdateActivity = Pick<
  ActivityWithProjectRoleId,
  'id' | 'description' | 'billable' | 'projectRoleId' | 'hasEvidences'
> & {
  interval: DateInterval
  evidence?: File
}
