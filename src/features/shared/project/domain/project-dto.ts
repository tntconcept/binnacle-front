import { Id } from '../../../../shared/types/id'
import { ProjectBillingType } from './project-billing-type'

export interface ProjectDto {
  id: Id
  name: string
  open: boolean
  startDate: string | null
  blockDate: string | null
  blockedByUser: Id | null
  organizationId: Id
  projectBillingType: ProjectBillingType
}
