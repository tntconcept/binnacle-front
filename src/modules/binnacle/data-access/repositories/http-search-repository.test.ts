import { mock } from 'jest-mock-extended'
import endpoints from 'shared/api/endpoints'
import { HttpClient } from 'shared/data-access/http-client/http-client'
import { buildSearchRolesResponse } from 'test-utils/generateTestMocks'
import { SearchRolesResponse } from '../interfaces/search-roles-response.interface'
import { HttpSearchRepository } from './http-search-repository'

describe('SearchRepository', () => {
  it('should get the roles information', async () => {
    const { searchRepository, httpClient } = setup()
    const roleIds = [1]
    const searchRolesResponse = buildSearchRolesResponse()

    httpClient.get.mockResolvedValue(searchRolesResponse)

    const result = await searchRepository.roles(roleIds)

    expect(httpClient.get).toHaveBeenCalledWith(endpoints.search, {
      params: { roleIds }
    })
    expect(result).toEqual(searchRolesResponse)
  })

  it('should return an empty response when role list is empty', async () => {
    const { searchRepository } = setup()
    const emptyResponse: SearchRolesResponse = {
      organizations: [],
      projects: [],
      projectRoles: []
    }

    const result = await searchRepository.roles([])

    expect(result).toEqual(emptyResponse)
  })
})

function setup() {
  const httpClient = mock<HttpClient>()

  return {
    httpClient,
    searchRepository: new HttpSearchRepository(httpClient)
  }
}
