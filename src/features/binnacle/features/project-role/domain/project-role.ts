import { Days } from 'shared/types/days'
import { Id } from 'shared/types/id'
import { Minutes } from 'shared/types/minutes'
import { TimeUnit } from 'shared/types/time-unit'
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
  // TODO: Remove max allowed
  maxAllowed: Days | Minutes
  // TODO: Remove remaining
  remaining: Days | Minutes
  timeUnit: TimeUnit
  requireEvidence: ProjectRoleRequireEvidence
  requireApproval: boolean
  userId: Id
}
