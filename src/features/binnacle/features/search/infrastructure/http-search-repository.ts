import { HttpClient } from 'shared/http/http-client'
import { singleton } from 'tsyringe'
import { SearchProjectRolesResult } from '../domain/search-project-roles-result'
import { SearchRepository, SearchRepositoryParams } from '../domain/search-repository'

@singleton()
export class HttpSearchRepository implements SearchRepository {
  protected static searchPath = '/api/search'

  constructor(private httpClient: HttpClient) {}

  async searchProjectRoles({
    ids: roleIds,
    year
  }: SearchRepositoryParams): Promise<SearchProjectRolesResult> {
    const isEmptyRoleList = roleIds.length === 0
    if (isEmptyRoleList) {
      return {
        organizations: [],
        projects: [],
        projectRoles: []
      }
    }

    // TODO: Remove when API is implemented
    return await this.httpClient
      .get<SearchProjectRolesResult>(HttpSearchRepository.searchPath, {
        params: { roleIds, year }
      })
      .then((x) => ({
        ...x,
        projectRoles: x.projectRoles.map((y) => ({
          ...y,
          timeInfo: {
            timeUnit: 'DAYS',
            maxTimeAllowed: {
              byYear: 2,
              byActivity: 2
            },
            userRemainingTime: 2
          }
        }))
      }))
  }
}
