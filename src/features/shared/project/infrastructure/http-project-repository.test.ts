import { mock } from 'jest-mock-extended'
import { HttpProjectRepository } from './http-project-repository'
import { chrono } from '../../../../shared/utils/chrono'
import { HttpClient } from '../../../../shared/http/http-client'
import { ProjectMother } from '../../../../test-utils/mothers/project-mother'

describe('HttpProjectRepository', () => {
  test('should get projects by organizationId', async () => {
    const { httpClient, projectRepository } = setup()

    httpClient.get.mockResolvedValue(ProjectMother.projectsFilteredByOrganization())

    const result = await projectRepository.getProjects({ organizationIds: [1], open: true })
    expect(httpClient.get).toHaveBeenCalledWith('/api/project', {
      params: { organizationIds: [1], open: true }
    })

    expect(result).toEqual(ProjectMother.projectsFilteredByOrganizationDateIso())
  })
  test('should call httpclient post with the correct parameters when block a project', async () => {
    const { httpClient, projectRepository } = setup()
    const date = new Date('2023-06-05')

    httpClient.post.mockResolvedValue('')

    await projectRepository.blockProject(1, date)

    expect(httpClient.post).toHaveBeenCalledWith('/api/project/1/block', {
      blockDate: chrono(chrono(date).toISOString()).format('yyyy-MM-dd')
    })
  })
  test('should call httpclient post with the correct parameters when unblock a project', async () => {
    const { httpClient, projectRepository } = setup()

    httpClient.post.mockResolvedValue('')

    await projectRepository.setUnblock(1)

    expect(httpClient.post).toHaveBeenCalledWith('/api/project/1/unblock')
  })
})

function setup() {
  const httpClient = mock<HttpClient>()

  return {
    httpClient,
    projectRepository: new HttpProjectRepository(httpClient)
  }
}
