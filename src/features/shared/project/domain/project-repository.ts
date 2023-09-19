import { Id } from '../../../../../shared/types/id'
import { OrganizationFilters } from './organization-filters'
import { Project } from './project'

export interface ProjectRepository {
  getProjects(organizationStatus?: OrganizationFilters): Promise<Project[]>

  blockProject(projectId: Id, date: Date): Promise<void>

  setUnblock(projectId: Id): Promise<void>
}
