import { GetUsersListQry } from '../../../../shared/user/application/get-users-list-qry'
import { mock } from 'jest-mock-extended'
import { GetProjectsListQry } from './get-projects-list-qry'
import { ProjectMother } from '../../../../shared/project/domain/tests/project-mother'
import { ProjectsWithUserName } from '../domain/services/projects-with-user-name'
import { GetProjectsQry } from '../../../../shared/project/application/binnacle/get-projects-qry'

describe('GetProjectsListQry', () => {
  it('should get the project list', async () => {
    const { getProjectsListQry, projectRepository, getUsersListQry } = setup()
    const organizationWithStatus = {
      organizationId: 1,
      open: true
    }

    projectRepository.execute.mockResolvedValue(
      ProjectMother.projectsFilteredByOrganizationDateIso()
    )

    await getProjectsListQry.internalExecute(organizationWithStatus)

    expect(projectRepository.execute).toBeCalledWith(organizationWithStatus)
    expect(getUsersListQry.execute).toHaveBeenCalledWith({ ids: [2, 1] })
  })
})

function setup() {
  const getProjectQry = mock<GetProjectsQry>()
  const getUsersListQry = mock<GetUsersListQry>()
  const projectsWithUserName = mock<ProjectsWithUserName>()

  return {
    getProjectsListQry: new GetProjectsListQry(
      getProjectQry,
      getUsersListQry,
      projectsWithUserName
    ),
    projectRepository: getProjectQry,
    getUsersListQry,
    projectsWithUserName
  }
}
