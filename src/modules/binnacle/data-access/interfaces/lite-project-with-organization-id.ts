import { Id } from 'shared/types/id'
import { Project } from './project.interface'

export type LiteProjectWithOrganizationId = Pick<Project, 'id' | 'name'> & {
  organizationId: Id
}
