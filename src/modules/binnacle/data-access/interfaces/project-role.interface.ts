import { Id } from 'shared/types/id'
import { TimeUnit } from 'shared/types/time-unit'

export interface ProjectRole {
  id: Id
  name: string
  requireEvidence: boolean
  timeUnit: TimeUnit
}
