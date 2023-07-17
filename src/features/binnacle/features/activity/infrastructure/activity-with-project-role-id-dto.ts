import { TimeUnit } from '../../../../../shared/types/time-unit'
import { ActivityWithProjectRoleId } from '../domain/activity-with-project-role-id'

export type ActivityWithProjectRoleIdDto = Omit<ActivityWithProjectRoleId, 'interval'> & {
  interval: {
    start: string
    end: string
    duration: number
    timeUnit: TimeUnit
  }
}
