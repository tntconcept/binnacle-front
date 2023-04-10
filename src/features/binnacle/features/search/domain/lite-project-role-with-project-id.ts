import { Id } from 'shared/types/id'
import { ProjectRole } from '../../project-role/domain/project-role'

export type LiteProjectRoleWithProjectId = Pick<ProjectRole, 'id' | 'name'> & {
  projectId: Id
}
