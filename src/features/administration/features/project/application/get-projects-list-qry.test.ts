import { mock } from 'jest-mock-extended'
import { ProjectRepository } from '../domain/project-repository'
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

  return {
    getProjectsListQry: new GetProjectsListQry(projectRepository),
    projectRepository
  }
}
