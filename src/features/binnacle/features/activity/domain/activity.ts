import { Id } from 'shared/types/id'
import { Organization } from '../../organization/domain/organization'
import { LiteProjectRoleWithProjectId } from '../../search/domain/lite-project-role-with-project-id'
import { LiteProjectWithOrganizationId } from '../../search/domain/lite-project-with-organization-id'
import { ActivityApprovalState } from './activity-approval-state'
import { ActivityInterval } from './activity-interval'

export interface Activity {
  id: Id
  description: string
  userId: number
  billable: boolean
  hasEvidences: boolean
  organization: Organization
  project: LiteProjectWithOrganizationId
  projectRole: LiteProjectRoleWithProjectId
  approvalState: ActivityApprovalState
  interval: ActivityInterval
}
