import { TimeUnit } from 'shared/types/time-unit'

export interface ProjectRole {
  id: number
  name: string
  requireEvidence: boolean
  timeUnit: TimeUnit
}
