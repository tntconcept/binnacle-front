import { describe, expect, it } from 'vitest'
import { Id } from '@archimedes/arch'
import { mock } from 'vitest-mock-extended'
import { HttpClient } from '../../../../../shared/http/http-client'
import { ProjectRoleMother } from '../../../../../test-utils/mothers/project-role-mother'
import { HttpProjectRoleRepository } from './http-project-role-repository'

describe('HttpProjectRoleRepository', () => {
  it('should get the recent roles', async () => {
    const { httpProjectRoleRepository, projectRoleResponse } = setup()

    const result = await httpProjectRoleRepository.getRecents(2023)

    expect(result).toEqual(projectRoleResponse)
  })

  it('should get all roles', async () => {
    const { httpProjectRoleRepository, projectRoleResponse } = setup()

    const result = await httpProjectRoleRepository.getAll({ projectId: 1, year: 2023 })

    expect(result).toEqual(projectRoleResponse)
  })
})

function setup() {
  const httpClient = mock<HttpClient>()

  const projectRoleResponse = ProjectRoleMother.nonHydratedProjectRoles()
  httpClient.get.calledWith('/api/project-role/latest').mockResolvedValue(projectRoleResponse)

  const projectRolePath = (projectId: Id) => `/api/project/${projectId}/role`
  httpClient.get.calledWith(projectRolePath(1)).mockResolvedValue(projectRoleResponse)

  return {
    httpProjectRoleRepository: new HttpProjectRoleRepository(httpClient),
    httpClient,
    projectRoleResponse
  }
}
