import { Id } from '../../../../../shared/types/id'
import { Organization } from '../../organization/domain/organization'
import { Project } from '../../project/domain/project'
import { ProjectRole } from './project-role'

export type NonHydratedProjectRole = Omit<ProjectRole, 'organization' | 'project' | 'user'> & {
  organizationId: Organization['id']
  projectId: Project['id']
  userId: Id
}
