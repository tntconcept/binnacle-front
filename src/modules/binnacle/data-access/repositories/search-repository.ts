import endpoints from 'shared/api/endpoints'
import { HttpClient } from 'shared/data-access/http-client/http-client'
import { singleton } from 'tsyringe'
import { SearchRolesResponse } from '../interfaces/search-roles-response.interface'

@singleton()
export class SearchRepository {
  constructor(private httpClient: HttpClient) {}

  async roles(ids: number[]): Promise<SearchRolesResponse> {
    const isEmptyRoleList = ids.length === 0
    if (isEmptyRoleList) {
      return {
        organizations: [],
        projects: [],
        projectRoles: []
      }
    }

    return await this.httpClient.get<SearchRolesResponse>(endpoints.search, {
      params: { roleIds: ids }
    })
  }
}
