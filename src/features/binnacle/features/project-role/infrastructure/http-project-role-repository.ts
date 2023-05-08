import { HttpClient } from 'shared/http/http-client'
import { Id } from 'shared/types/id'
import { singleton } from 'tsyringe'
import { NonHydratedProjectRole } from '../domain/non-hydrated-project-role'
import { ProjectRoleRepository } from '../domain/project-role-repository'

@singleton()
export class HttpProjectRoleRepository implements ProjectRoleRepository {
  protected static projectRolePath = (projectId: Id) => `/api/projects/${projectId}/roles`
  protected static recentsPath = '/api/project-role/latest'

  constructor(private httpClient: HttpClient) {}
  getRecents(): Promise<NonHydratedProjectRole[]> {
    return this.httpClient.get<NonHydratedProjectRole[]>(HttpProjectRoleRepository.recentsPath)
  }

  getAll(projectId: Id): Promise<NonHydratedProjectRole[]> {
    return this.httpClient.get<NonHydratedProjectRole[]>(
      HttpProjectRoleRepository.projectRolePath(projectId)
    )
  }
}
