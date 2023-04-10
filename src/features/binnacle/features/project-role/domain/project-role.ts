import { Days } from 'shared/types/days'
import { Id } from 'shared/types/id'
import { Minutes } from 'shared/types/minutes'
import { TimeUnit } from 'shared/types/time-unit'
import { Organization } from '../../organization/domain/organization'
import { LiteProject } from '../../project/domain/lite-project'
import { ProjectRoleRequireEvidence } from './project-role-require-evidence'

export interface ProjectRole {
  id: Id
  name: string
  organization: Organization
  project: LiteProject
  maxAllowed?: Days | Minutes
  remaining?: Days | Minutes
  timeUnit: TimeUnit
  requireEvidence: ProjectRoleRequireEvidence
  requireApproval: boolean
  userId: Id
}
