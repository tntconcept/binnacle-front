import { HttpClient } from 'shared/http/http-client'
import { Id } from 'shared/types/id'
import { singleton } from 'tsyringe'
import { NonHydratedProjectRole } from '../domain/non-hydrated-project-role'
import { ProjectRoleRepository } from '../domain/project-role-repository'

@singleton()
export class HttpProjectRoleRepository implements ProjectRoleRepository {
  protected static projectRolePath = (projectId: Id) => `/api/project/${projectId}/role`
  protected static recentsPath = '/api/project-role/latest'

  constructor(private httpClient: HttpClient) {}

  getRecents(year: number): Promise<NonHydratedProjectRole[]> {
    return this.httpClient.get<NonHydratedProjectRole[]>(HttpProjectRoleRepository.recentsPath, {
      params: {
        year: year
      }
    })
  }

  getAll(projectId: Id): Promise<NonHydratedProjectRole[]> {
    return this.httpClient.get<NonHydratedProjectRole[]>(
      HttpProjectRoleRepository.projectRolePath(projectId)
    )
  }
}
