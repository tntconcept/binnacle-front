import { Id } from 'shared/types/id'

export interface RecentRole {
  id: Id
  name: string
  requireEvidence: boolean
  projectName: string
  projectBillable: boolean
  organizationName: string
  date: string
}
