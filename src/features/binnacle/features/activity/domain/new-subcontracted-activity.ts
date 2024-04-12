//import { DateInterval } from '../../../../../shared/types/date-interval'
import { SubcontractedActivityWithProjectRoleId } from './subcontracted-activity-with-project-role-id'

export type NewSubcontractedActivity = Pick<
  SubcontractedActivityWithProjectRoleId,
  'description' | 'billable' | 'projectRoleId' | 'duration' | 'month'
>

/*
import { DateInterval } from '../../../../../shared/types/date-interval'
import { ActivityWithProjectRoleId } from './activity-with-project-role-id'

export type NewActivity = Pick<
  ActivityWithProjectRoleId,
  'description' | 'billable' | 'projectRoleId' | 'hasEvidences'
> & {
  interval: DateInterval
  evidence?: File
}
*/
