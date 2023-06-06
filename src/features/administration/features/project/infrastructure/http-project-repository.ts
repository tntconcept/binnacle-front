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
export class HttpProjectRepository implements ProjectRepository {
  protected static projectPath = '/api/project'
  protected static blockPath = (projectId: Id) => `/api/project/${projectId}/block`
  protected static unBlockPath = (projectId: Id) => `/api/project/${projectId}/unblock`

  constructor(private httpClient: HttpClient) {}

  async getProjects(organizationWithStatus?: OrganizationWithStatus): Promise<Project[]> {
    if (organizationWithStatus) {
      const { organizationId, open } = organizationWithStatus
      const data = await this.httpClient.get<ProjectDto[]>(HttpProjectRepository.projectPath, {
        params: {
          organizationId: organizationId,
          open: open
        }
      })
      return ProjectMapper.toDomainList(data)
    }
    return []
  }

  async setBlock({ projectId, date }: ProjectWithDate): Promise<void> {
    const data = {
      date: chrono(date).toISOString()
    }
    await this.httpClient.post(HttpProjectRepository.blockPath(projectId), data)
  }

  async setUnblock(projectId: Id): Promise<void> {
    await this.httpClient.post(HttpProjectRepository.unBlockPath(projectId))
  }
}
