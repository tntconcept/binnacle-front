import { HttpClient } from 'shared/http/http-client'
import { singleton } from 'tsyringe'
import { Id } from '../../../../../shared/types/id'
import { chrono } from '../../../../../shared/utils/chrono'
import { OrganizationWithStatus } from '../domain/organization-status'
import { Project } from '../domain/project'
import { ProjectDto } from '../domain/project-dto'
import { ProjectRepository } from '../domain/project-repository'
import { ProjectMapper } from './project-mapper'

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

  async blockProject(projectId: Id, date: Date): Promise<void> {
    const data = {
      blockDate: chrono(chrono(date).toISOString()).format('yyyy-MM-dd')
    }
    await this.httpClient.post(HttpProjectRepository.blockPath(projectId), data)
  }

  async setUnblock(projectId: Id): Promise<void> {
    await this.httpClient.post(HttpProjectRepository.unBlockPath(projectId))
  }
}
