import { TimeUnit } from 'shared/types/time-unit'
import { ActivityWithProjectRoleId } from '../../interfaces/activity-with-project-role-id.interface'

export type ActivityWithProjectRoleIdDto = Omit<ActivityWithProjectRoleId, 'interval'> & {
  interval: {
    start: string
    end: string
    duration: number
    timeUnit: TimeUnit
  }
}
