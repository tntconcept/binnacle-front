import { Id } from 'shared/types/id'
import { TimeUnit } from 'shared/types/time-unit'

export interface RecentRole {
  id: Id
  name: string
  requireEvidence: boolean
  projectName: string
  projectBillable: boolean
  organizationName: string
  date: string
  timeUnit: TimeUnit
}
