import { mock } from 'jest-mock-extended'
import { ProjectMother } from '../../domain/tests/project-mother'
import { ProjectRepository } from '../../domain/project-repository'
import { GetUsersListQry } from '../../../user/application/get-users-list-qry'
import { ProjectsWithUserName } from '../../domain/services/projects-with-user-name'
import { GetProjectsListQry } from './get-projects-list-qry'

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
