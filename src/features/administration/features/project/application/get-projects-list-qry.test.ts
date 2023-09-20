import { GetUsersListQry } from '../../../../shared/user/application/get-users-list-qry'
import { mock } from 'jest-mock-extended'
import { ProjectRepository } from '../domain/project-repository'
import { ProjectsWithUserName } from '../domain/services/projects-with-user-name'
import { GetProjectsListQry } from './get-projects-list-qry'
import { ProjectMother } from '../domain/tests/project-mother'

describe('GetProjectsListQry', () => {
  it('should get the project list', async () => {
    const { getProjectsListQry, projectRepository, getUsersListQry } = setup()
    const organizationWithStatus = {
      organizationId: 1,
      open: true
    }

    projectRepository.getProjects.mockResolvedValue(
      ProjectMother.projectsFilteredByOrganizationDateIso()
    )

    await getProjectsListQry.internalExecute(organizationWithStatus)

    expect(projectRepository.getProjects).toBeCalledWith(organizationWithStatus)
    expect(getUsersListQry.execute).toHaveBeenCalledWith({ ids: [2, 1] })
  })

  it('should not make user request if there is no projects', async () => {
    const { getProjectsListQry, projectRepository, getUsersListQry } = setup()
    const organizationWithStatus = {
      organizationId: 1,
      open: true
    }

    projectRepository.getProjects.mockResolvedValue([
      ProjectMother.projectsFilteredByOrganizationDateIso()[2]
    ])

    await getProjectsListQry.internalExecute(organizationWithStatus)

    expect(projectRepository.getProjects).toBeCalledWith(organizationWithStatus)
    expect(getUsersListQry.execute).not.toHaveBeenCalled()
  })
})

function setup() {
  const projectRepository = mock<ProjectRepository>()
  const getUsersListQry = mock<GetUsersListQry>()
  const projectsWithUserName = mock<ProjectsWithUserName>()

  return {
    getProjectsListQry: new GetProjectsListQry(
      projectRepository,
      getUsersListQry,
      projectsWithUserName
    ),
    projectRepository,
    getUsersListQry,
    projectsWithUserName
  }
}
