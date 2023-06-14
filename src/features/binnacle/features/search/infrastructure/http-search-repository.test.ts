import { mock } from 'jest-mock-extended'
import { HttpClient } from 'shared/http/http-client'
import { SearchMother } from 'test-utils/mothers/search-mother'
import { HttpSearchRepository } from './http-search-repository'
import { SearchRepositoryParams } from '../domain/search-repository'

describe('HttpSearchRepository', () => {
  it('should search project roles by id', async () => {
    const { httpSearchRepository, rolesResponse } = setup()
    const params: SearchRepositoryParams = { ids: [1], year: 2023 }

    const result = await httpSearchRepository.searchProjectRoles(params)

    expect(result).toEqual(rolesResponse)
  })

  it('should return an empty list when not ids provided', async () => {
    const { httpSearchRepository } = setup()
    const emptyRolesResponse = SearchMother.emptyRoles()
    const params: SearchRepositoryParams = { ids: [], year: 2023 }

    const result = await httpSearchRepository.searchProjectRoles(params)

    expect(result).toEqual(emptyRolesResponse)
  })
})

function setup() {
  const httpClient = mock<HttpClient>()

  const rolesResponse = SearchMother.roles()
  httpClient.get.calledWith('/api/search').mockResolvedValue(rolesResponse)

  return {
    httpSearchRepository: new HttpSearchRepository(httpClient),
    httpClient,
    rolesResponse
  }
}
