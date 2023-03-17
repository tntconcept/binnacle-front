import { HttpClient } from 'shared/data-access/http-client/http-client'
import { mock } from 'jest-mock-extended'
import { buildProject, mockProjectRole } from 'test-utils/generateTestMocks'
import endpoints from 'shared/api/endpoints'
import { HttpCombosRepository } from './http-combos-repository'
import { OrganizationMother } from 'test-utils/mothers/organization-mother'

describe('HttpCombosRepository', () => {
  it('should get organizations', async () => {
    const { combosRepository, httpClient } = setup()

    const organizations = [OrganizationMother.organization()]
    httpClient.get.mockResolvedValue(organizations)

    const result = await combosRepository.getOrganizations()

    expect(httpClient.get).toHaveBeenCalledWith(endpoints.organizations)
    expect(result).toEqual(organizations)
  })

  it('should get projects', async () => {
    const { combosRepository, httpClient } = setup()

    const projects = [buildProject()]
    httpClient.get.mockResolvedValue(projects)

    const result = await combosRepository.getProjects(1)

    expect(httpClient.get).toHaveBeenCalledWith(`${endpoints.organizations}/${1}/projects`)
    expect(result).toEqual(projects)
  })

  it('should get project roles', async () => {
    const { combosRepository, httpClient } = setup()

    const roles = [mockProjectRole()]
    httpClient.get.mockResolvedValue(roles)

    const result = await combosRepository.getProjectRoles(1)

    expect(httpClient.get).toHaveBeenCalledWith(`${endpoints.projects}/${1}/roles`)
    expect(result).toEqual(roles)
  })
})

function setup() {
  const httpClient = mock<HttpClient>()

  return {
    httpClient,
    combosRepository: new HttpCombosRepository(httpClient)
  }
}
