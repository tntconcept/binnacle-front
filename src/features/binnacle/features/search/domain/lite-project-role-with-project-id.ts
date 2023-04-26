import { Id } from 'shared/types/id'
import { ProjectRole } from '../../project-role/domain/project-role'

export type LiteProjectRoleWithProjectId = Omit<
  ProjectRole,
  'organization' | 'project' | 'userId'
> & {
  projectId: Id
}
