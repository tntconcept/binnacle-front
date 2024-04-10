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
