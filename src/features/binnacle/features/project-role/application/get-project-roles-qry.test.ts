import { mock } from 'jest-mock-extended'
import { ProjectRoleMother } from 'test-utils/mothers/project-role-mother'
import { ProjectRoleRepository } from '../domain/project-role-repository'
import { GetProjectRolesQry } from './get-project-roles-qry'

describe('GetProjectRolesQry', () => {
  it('should get all the project roles', async () => {
    const { getProjectRolesQry, nonHydrateProjectRoles } = setup()

    const result = await getProjectRolesQry.internalExecute({ projectId: 1, year: 2023 })

    expect(result).toEqual(nonHydrateProjectRoles)
  })
})

function setup() {
  const projectRoleRepository = mock<ProjectRoleRepository>()

  const nonHydrateProjectRoles = ProjectRoleMother.nonHydratedProjectRoles()
  projectRoleRepository.getAll.mockResolvedValue(nonHydrateProjectRoles)

  return {
    getProjectRolesQry: new GetProjectRolesQry(projectRoleRepository),
    nonHydrateProjectRoles
  }
}
