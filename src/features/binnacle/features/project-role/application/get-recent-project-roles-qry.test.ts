import { describe, expect, it } from 'vitest'
import { mock } from 'vitest-mock-extended'
import { ProjectRoleMother } from '../../../../../test-utils/mothers/project-role-mother'
import { SearchMother } from '../../../../../test-utils/mothers/search-mother'
import { SearchProjectRolesQry } from '../../search/application/search-project-roles-qry'
import { HydrateProjectRoles } from '../domain/hydrate-project-roles'
import { ProjectRoleRepository } from '../domain/project-role-repository'
import { GetRecentProjectRolesQry } from './get-recent-project-roles-qry'

describe('GetRecentProjectRolesQry', () => {
  it('should get recent roles', async () => {
    const { getRecentProjectRolesQry, projectRoles } = setup()

    const result = await getRecentProjectRolesQry.internalExecute(2023)

    expect(result).toEqual(projectRoles)
  })
})

function setup() {
  const projectRoleRepository = mock<ProjectRoleRepository>()
  const searchProjectRolesQry = mock<SearchProjectRolesQry>()
  const hydrateProjectRoles = mock<HydrateProjectRoles>()

  const nonHydratedProjectRoles = ProjectRoleMother.nonHydratedProjectRoles()
  projectRoleRepository.getRecents.mockResolvedValue(nonHydratedProjectRoles)

  const seachResult = SearchMother.roles()
  searchProjectRolesQry.execute.mockResolvedValue(seachResult)

  const projectRoles = ProjectRoleMother.projectRoles()
  hydrateProjectRoles.hydrate
    .calledWith(nonHydratedProjectRoles, seachResult)
    .mockReturnValue(projectRoles)

  return {
    getRecentProjectRolesQry: new GetRecentProjectRolesQry(
      projectRoleRepository,
      searchProjectRolesQry,
      hydrateProjectRoles
    ),
    projectRoleRepository,
    projectRoles
  }
}
