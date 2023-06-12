import { Id } from 'shared/types/id'
import { OrganizationWithStatus } from './organization-status'
import { Project } from './project'

export interface ProjectRepository {
  getProjects(organizationStatus?: OrganizationWithStatus): Promise<Project[]>
  blockProject(projectId: Id, date: Date): Promise<void>
  setUnblock(projectId: Id): Promise<void>
}
