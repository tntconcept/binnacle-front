import { HttpClient } from 'shared/http/http-client'
import { Id } from 'shared/types/id'
import { singleton } from 'tsyringe'
import { Project } from '../domain/project'
import { ProjectRepository } from '../domain/project-repository'

@singleton()
export class HttpProjectRepository implements ProjectRepository {
  protected static projectPath = (organizationId: Id) => `/organization/${organizationId}/project`

  constructor(private httpClient: HttpClient) {}

  getAll(organizationId: Id): Promise<Project[]> {
    return this.httpClient.get(HttpProjectRepository.projectPath(organizationId))
  }
}
