import { Id } from '../../../../shared/types/id'
import { ProjectBillingType } from './project-billing-type'

export interface Project {
  id: Id
  name: string
  billable: boolean
  open: boolean
  startDate: Date | null
  blockDate: Date | null
  blockedByUser: Id | null
  organizationId: Id
  blockedByUserName?: string
  projectBillingType: ProjectBillingType
}
