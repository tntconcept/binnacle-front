import { Id } from 'shared/types/id'
import { Project } from '../../project/domain/project'

export type LiteProjectWithOrganizationId = Pick<Project, 'id' | 'name'> & {
  organizationId: Id
}
