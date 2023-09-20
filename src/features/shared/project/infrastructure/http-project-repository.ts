import { singleton } from 'tsyringe'
import { ProjectOrganizationFilters } from '../domain/project-organization-filters'
import { Project } from '../domain/project'
import { ProjectDto } from '../domain/project-dto'
import { ProjectRepository } from '../domain/project-repository'
import { ProjectMapper } from './project-mapper'
import { Id } from '../../../../shared/types/id'
import { HttpClient } from '../../../../shared/http/http-client'
import { chrono } from '../../../../shared/utils/chrono'

@singleton()
export class HttpProjectRepository implements ProjectRepository {
  protected static projectPath = '/api/project'
  protected static blockPath = (projectId: Id) => `/api/project/${projectId}/block`
  protected static unBlockPath = (projectId: Id) => `/api/project/${projectId}/unblock`

  constructor(private httpClient: HttpClient) {}

  async getProjects(organizationWithStatus: ProjectOrganizationFilters): Promise<Project[]> {
    const data = await this.httpClient.get<ProjectDto[]>(HttpProjectRepository.projectPath, {
      params: organizationWithStatus
    })
    return ProjectMapper.toDomainList(data)
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
