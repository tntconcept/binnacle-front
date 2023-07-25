import { Id } from '../../../../../shared/types/id'
import { Organization } from '../../organization/domain/organization'
import { LiteProject } from '../../project/domain/lite-project'
import { LiteProjectWithOrganizationId } from '../../search/domain/lite-project-with-organization-id'
import { ProjectRoleRequireEvidence } from './project-role-require-evidence'
import { TimeInfo } from './project-role-time-info'

export interface ProjectRole {
  id: Id
  name: string
  organization: Organization
  project: LiteProject | LiteProjectWithOrganizationId
  timeInfo: TimeInfo
  requireEvidence: ProjectRoleRequireEvidence
  requireApproval: boolean
  userId: Id
}
