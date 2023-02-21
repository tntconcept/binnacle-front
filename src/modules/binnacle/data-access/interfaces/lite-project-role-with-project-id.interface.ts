import { ProjectRole } from './project-role.interface'

export type LiteProjectRoleWithProjectId = Pick<ProjectRole, 'id' | 'name'> & {
  projectId: number
}
