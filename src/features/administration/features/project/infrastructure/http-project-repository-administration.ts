import { HttpClient } from 'shared/http/http-client'
import { singleton } from 'tsyringe'
import { Id } from '../../../../../shared/types/id'
import { ProjectRepository } from '../domain/project-repository'
import { Project } from '../domain/project'
import chrono from '../../../../../shared/utils/chrono'
import { ProjectMapper } from './project-mapper'
import { ProjectDto } from '../domain/project-dto'
import { OrganizationWithStatus } from '../domain/organization-status'
import { ProjectWithDate } from '../domain/project-date'

@singleton()
export class HttpProjectRepositoryAdministration implements ProjectRepository {
  protected static projectPath = '/api/project'
  protected static blockPath = (projectId: Id) => `/api/project/${projectId}/block`
  protected static unBlockPath = (projectId: Id) => `/api/project/${projectId}/unblock`

  constructor(private httpClient: HttpClient) {}

  async getProjects(organizationWithStatus?: OrganizationWithStatus): Promise<Project[]> {
    if (organizationWithStatus) {
      const { organizationId, open } = organizationWithStatus
      const data = await this.httpClient.get<ProjectDto[]>(
        HttpProjectRepositoryAdministration.projectPath,
        {
          params: {
            organizationId: organizationId,
            open: open
          }
        }
      )
      return ProjectMapper.toDomainList(data)
    }
    return []
  }

  async setBlock({ projectId, date }: ProjectWithDate): Promise<void> {
    const data = {
      blockDate: chrono(chrono(date).toISOString()).format('yyyy-MM-dd')
    }
    await this.httpClient.post(HttpProjectRepositoryAdministration.blockPath(projectId), data)
  }

  async setUnblock(projectId: Id): Promise<void> {
    await this.httpClient.post(HttpProjectRepositoryAdministration.unBlockPath(projectId))
  }
}
