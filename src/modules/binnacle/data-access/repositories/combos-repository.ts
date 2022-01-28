import type { Organization } from 'modules/binnacle/data-access/interfaces/organization.interface'
import type { ProjectRole } from 'modules/binnacle/data-access/interfaces/project-role.interface'
import type { Project } from 'modules/binnacle/data-access/interfaces/project.interface'
import endpoints from 'shared/api/endpoints'
import { HttpClient } from 'shared/data-access/http-client/http-client'
import { singleton } from 'tsyringe'

@singleton()
export class CombosRepository {
  constructor(private httpClient: HttpClient) {}

  async getOrganizations(): Promise<Organization[]> {
    return await this.httpClient.get(endpoints.organizations)
  }

  async getProjects(organizationId: number): Promise<Project[]> {
    return await this.httpClient.get(`${endpoints.organizations}/${organizationId}/projects`)
  }

  async getProjectRoles(projectId: number): Promise<ProjectRole[]> {
    return await this.httpClient.get(`${endpoints.projects}/${projectId}/roles`)
  }
}
