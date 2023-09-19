import { Id } from '../../../../../shared/types/id'

export interface ProjectDto {
  id: Id
  name: string
  billable: boolean
  open: boolean
  startDate: string | null
  blockDate: string | null
  blockedByUser: Id | null
  organizationId: Id
}
