import type { Organization } from 'modules/binnacle/data-access/interfaces/organization.interface'
import { Id } from 'shared/types/id'
import { ActivityApprovalState } from './activity-approval-state.interface'
import { ActivityInterval } from './activity-interval.interface'
import { LiteProjectRoleWithProjectId } from './lite-project-role-with-project-id.interface'
import { LiteProjectWithOrganizationId } from './lite-project-with-organization-id'

export interface Activity {
  id: Id
  description: string
  userId: number
  billable: boolean
  hasEvidence: boolean
  organization: Organization
  project: LiteProjectWithOrganizationId
  projectRole: LiteProjectRoleWithProjectId
  approvalState: ActivityApprovalState
  interval: ActivityInterval
}
