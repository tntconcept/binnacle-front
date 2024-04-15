import { Id } from '../../../../../shared/types/id'
import { Organization } from '../../organization/domain/organization'
import { LiteProjectRoleWithProjectId } from '../../search/domain/lite-project-role-with-project-id'
import { LiteProjectWithOrganizationId } from '../../search/domain/lite-project-with-organization-id'

export interface SubcontractedActivity {
  id: Id
  description: string
  userId: Id
  billable: boolean
  organization: Organization
  project: LiteProjectWithOrganizationId
  projectRole: LiteProjectRoleWithProjectId
  duration: number
  month: string
  userName?: string
}
