import { mock } from 'jest-mock-extended'
import { SearchMother } from 'test-utils/mothers/search-mother'
import { SearchRepository } from '../domain/search-repository'
import { SearchProjectRolesQry } from './search-project-roles-qry'

describe('SearchProjectRolesQry', () => {
  it('should search for roles by id', async () => {
    const { searchProjectRolesQry, searchRepository, rolesResponse } = setup()
    const ids: number[] = [1]
    searchRepository.searchProjectRoles.calledWith(ids).mockResolvedValue(rolesResponse)

    const result = await searchProjectRolesQry.internalExecute(ids)

    expect(result).toEqual(rolesResponse)
  })

  it('should return an empty search when the array is empty', async () => {
    const { searchProjectRolesQry, emptyRolesResponse, searchRepository } = setup()
    const ids: number[] = []
    searchRepository.searchProjectRoles.calledWith(ids).mockResolvedValue(emptyRolesResponse)

    const result = await searchProjectRolesQry.internalExecute(ids)

    expect(result).toEqual(emptyRolesResponse)
  })
})

function setup() {
  const searchRepository = mock<SearchRepository>()
  const rolesResponse = SearchMother.roles()
  const emptyRolesResponse = SearchMother.emptyRoles()

  return {
    searchProjectRolesQry: new SearchProjectRolesQry(searchRepository),
    searchRepository,
    rolesResponse,
    emptyRolesResponse
  }
}
