import { mock } from 'jest-mock-extended'
import { HttpClient } from '../../../../../shared/http/http-client'
import { HttpProjectRepository } from './http-project-repository'
import { ProjectMother } from '../../../../../test-utils/mothers/project-mother'
import { OrganizationMother } from '../../../../../test-utils/mothers/organization-mother'

describe('HttpProjectRepository', () => {
  it('should call http client for projects', async () => {
    const { httpClient, httpProjectRepository } = setup()
    const organizations = ProjectMother.projects()
    httpClient.get.mockResolvedValue(ProjectMother.projects())

    const result = await httpProjectRepository.getAll(OrganizationMother.organization().id)

    expect(httpClient.get).toHaveBeenCalled()
    expect(result).toEqual(organizations)
  })
})

function setup() {
  const httpClient = mock<HttpClient>()

  return {
    httpClient,
    httpProjectRepository: new HttpProjectRepository(httpClient)
  }
}
