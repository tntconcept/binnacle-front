import { HttpClient } from 'shared/data-access/http-client/http-client'
import { mock } from 'jest-mock-extended'
import { buildOrganization, buildProject, mockProjectRole } from 'test-utils/generateTestMocks'
import endpoints from 'shared/api/endpoints'
import { CombosRepository } from 'modules/binnacle/data-access/repositories/combos-repository'

describe('CombosRepository', () => {
  it('should get organizations', async () => {
    const { combosRepository, httpClient } = setup()

    const organizations = [buildOrganization()]
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
    combosRepository: new CombosRepository(httpClient)
  }
}
