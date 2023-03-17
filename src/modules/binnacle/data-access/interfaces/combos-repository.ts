import type { Organization } from 'modules/binnacle/data-access/interfaces/organization.interface'
import type { ProjectRole } from 'modules/binnacle/data-access/interfaces/project-role.interface'
import type { Project } from 'modules/binnacle/data-access/interfaces/project.interface'
import { Id } from 'shared/types/id'

export interface CombosRepository {
  getOrganizations(): Promise<Organization[]>
  getProjects(organizationId: Id): Promise<Project[]>
  getProjectRoles(projectId: Id): Promise<ProjectRole[]>
}
