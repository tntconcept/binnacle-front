import { TimeUnit } from '../../../../../shared/types/time-unit'
import { SubcontractedActivityWithProjectRoleId } from '../domain/subcontracted-activity-with-project-role-id'

export type SubcontractedActivityWithProjectRoleIdDto = Omit<
  SubcontractedActivityWithProjectRoleId,
  'interval'
> & {
  interval: {
    start: string
    end: string
    duration: number
    timeUnit: TimeUnit
  }
}

/* import { TimeUnit } from '../../../../../shared/types/time-unit'
import { ActivityWithProjectRoleId } from '../domain/activity-with-project-role-id'

export type ActivityWithProjectRoleIdDto = Omit<ActivityWithProjectRoleId, 'interval'> & {
  interval: {
    start: string
    end: string
    duration: number
    timeUnit: TimeUnit
  }
} */
