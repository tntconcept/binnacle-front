import { Id } from '../../../../../shared/types/id'
import { Organization } from '../../organization/domain/organization'
import { LiteProjectRoleWithProjectId } from '../../search/domain/lite-project-role-with-project-id'
import { LiteProjectWithOrganizationId } from '../../search/domain/lite-project-with-organization-id'
import { ActivityInterval } from './activity-interval'
import { ActivityApproval } from './activity-approval'

export interface Activity {
  id: Id
  description: string
  userId: number
  billable: boolean
  hasEvidences: boolean
  canBeApproved: boolean
  organization: Organization
  project: LiteProjectWithOrganizationId
  projectRole: LiteProjectRoleWithProjectId
  approval: ActivityApproval
  interval: ActivityInterval
  userName?: string
}
