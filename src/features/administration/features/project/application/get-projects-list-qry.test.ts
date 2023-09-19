import { GetUsersListQry } from '../../../../shared/user/application/get-users-list-qry'
import { mock } from 'jest-mock-extended'
import { GetProjectsListQry } from './get-projects-list-qry'
import { ProjectRepository } from '../../../../shared/project/domain/project-repository'
import { ProjectMother } from '../../../../shared/project/domain/tests/project-mother'
import { ProjectsWithUserName } from '../domain/services/projects-with-user-name'

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
