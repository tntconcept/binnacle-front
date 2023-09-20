import { GetUsersListQry } from '../../../../shared/user/application/get-users-list-qry'
import { mock } from 'jest-mock-extended'
import { GetProjectsWithBlockerUserName } from './get-projects-with-blocker-user-name'
import { ProjectMother } from '../../../../shared/project/domain/tests/project-mother'
import { ProjectsWithUserName } from '../domain/services/projects-with-user-name'
import { GetProjectsQry } from '../../../../shared/project/application/binnacle/get-projects-qry'

describe('GetProjectsWithBlockerUserName', () => {
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

  it('should not make user request if there is no projects', async () => {
    const { getProjectsListQry, projectRepository, getUsersListQry } = setup()
    const organizationWithStatus = {
      organizationId: 1,
      open: true
    }

    projectRepository.execute.mockResolvedValue([
      ProjectMother.projectsFilteredByOrganizationDateIso()[2]
    ])

    await getProjectsListQry.internalExecute(organizationWithStatus)

    expect(projectRepository.execute).toBeCalledWith(organizationWithStatus)
    expect(getUsersListQry.execute).not.toHaveBeenCalled()
  })
})

function setup() {
  const getProjectQry = mock<GetProjectsQry>()
  const getUsersListQry = mock<GetUsersListQry>()
  const projectsWithUserName = mock<ProjectsWithUserName>()

  return {
    getProjectsListQry: new GetProjectsWithBlockerUserName(
      getProjectQry,
      getUsersListQry,
      projectsWithUserName
    ),
    projectRepository: getProjectQry,
    getUsersListQry,
    projectsWithUserName
  }
}
