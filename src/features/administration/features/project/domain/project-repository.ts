import { Project } from './project'
import { Id } from '@archimedes/arch'
import { OrganizationWithStatus } from './organization-status'
import { ProjectWithDate } from './project-date'

export interface ProjectRepository {
  getProjects(organizationStatus?: OrganizationWithStatus): Promise<Project[]>
  setBlock(projectDate: ProjectWithDate): Promise<void>
  setUnblock(projectId: Id): Promise<void>
}
