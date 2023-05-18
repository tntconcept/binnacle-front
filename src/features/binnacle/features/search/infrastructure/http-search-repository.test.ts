import { mock } from 'jest-mock-extended'
import { HttpClient } from 'shared/http/http-client'
import { SearchMother } from 'test-utils/mothers/search-mother'
import { HttpSearchRepository } from './http-search-repository'

describe('HttpSearchRepository', () => {
  it('should search project roles by id', async () => {
    const { httpSearchRepository, rolesResponse } = setup()
    const roleIds: number[] = [1]

    const result = await httpSearchRepository.searchProjectRoles(roleIds)

    expect(result).toEqual(rolesResponse)
  })

  it('should return an empty list when not ids provided', async () => {
    const { httpSearchRepository } = setup()
    const emptyRolesResponse = SearchMother.emptyRoles()

    const result = await httpSearchRepository.searchProjectRoles([])

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
