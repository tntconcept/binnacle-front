import { Id } from '../../../../../shared/types/id'
import { Organization } from '../../organization/domain/organization'
import { LiteProjectRoleWithProjectId } from '../../search/domain/lite-project-role-with-project-id'
import { LiteProjectWithOrganizationId } from '../../search/domain/lite-project-with-organization-id'
import { ActivityInterval } from './activity-interval'
import { ActivityApproval } from './activity-approval'
import { Uuid } from '../../attachments/domain/uuid'

export interface Activity {
  id: Id
  description: string
  userId: Id
  billable: boolean
  evidences: Uuid[]
  organization: Organization
  project: LiteProjectWithOrganizationId
  projectRole: LiteProjectRoleWithProjectId
  approval: ActivityApproval
  interval: ActivityInterval
  userName?: string
}

export function hasEvidence(activity: Activity): boolean {
  return activity.evidences.length > 0
}
