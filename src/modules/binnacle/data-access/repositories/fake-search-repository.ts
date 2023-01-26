import { buildSearchRolesResponse } from 'test-utils/generateTestMocks'
import { singleton } from 'tsyringe'
import { SearchRolesResponse } from '../interfaces/search-roles-response.interface'

@singleton()
export class FakeSearchRepository {
  async roles(ids: number[]): Promise<SearchRolesResponse> {
    console.log({ ids })
    return buildSearchRolesResponse()
  }
}
