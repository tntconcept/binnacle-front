import { Id } from 'shared/types/id'
import { ProjectRole } from './project-role.interface'

export type LiteProjectRoleWithProjectId = Pick<ProjectRole, 'id' | 'name'> & {
  projectId: Id
}
