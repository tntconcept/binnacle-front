import { Project } from './project.interface'

export type LiteProjectWithOrganizationId = Pick<Project, 'id' | 'name'> & {
  organizationId: number
}
