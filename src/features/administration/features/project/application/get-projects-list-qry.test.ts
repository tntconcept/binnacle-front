import { GetUsersListQry } from '../../../../shared/user/application/get-users-list-qry'
import { mock } from 'jest-mock-extended'
import { ProjectRepository } from '../domain/project-repository'
import { ProjectsWithUserName } from '../domain/services/projects-with-user-name'
import { GetProjectsListQry } from './get-projects-list-qry'

describe('GetProjectsListQry', () => {
  it('should get the project list', async () => {
    const { getProjectsListQry, projectRepository } = setup()
    const organizationWithStatus = {
      organizationId: 1,
      open: true
    }

    await getProjectsListQry.internalExecute(organizationWithStatus)

    expect(projectRepository.getProjects).toBeCalledWith(organizationWithStatus)
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
