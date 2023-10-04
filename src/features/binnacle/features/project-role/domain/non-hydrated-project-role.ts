import { Id } from '../../../../../shared/types/id'
import { Organization } from '../../organization/domain/organization'
import { ProjectRole } from './project-role'
import { Project } from '../../../../shared/project/domain/project'

export type NonHydratedProjectRole = Omit<ProjectRole, 'organization' | 'project' | 'user'> & {
  organizationId: Organization['id']
  projectId: Project['id']
  userId: Id
}
