import type { Organization } from 'modules/binnacle/data-access/interfaces/organization.interface'
import type { ProjectRole } from 'modules/binnacle/data-access/interfaces/project-role.interface'
import type { Project } from 'modules/binnacle/data-access/interfaces/project.interface'

export interface CombosRepository {
  getOrganizations(): Promise<Organization[]>
  getProjects(organizationId: number): Promise<Project[]>
  getProjectRoles(projectId: number): Promise<ProjectRole[]>
}
