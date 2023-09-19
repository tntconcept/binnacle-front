import { mock } from 'jest-mock-extended'
import { GetProjectsQry } from './get-projects-qry'
import { LiteProjectMother } from '../../../../../test-utils/mothers/lite-project-mother'
import { OrganizationMother } from '../../../../../test-utils/mothers/organization-mother'
import { ProjectRepository } from '../../domain/project-repository'

describe('GetProjectsQry', () => {
  it('should get projects from repository', async () => {
    const { getProjectQry, projectRepository } = setup()
    const projects = LiteProjectMother.projects()
    projectRepository.getProjects.mockResolvedValue(projects)

    const response = await getProjectQry.internalExecute({
      organizationIds: [OrganizationMother.organization().id],
      open: true
    })

    expect(projectRepository.getProjects).toHaveBeenCalled()
    expect(response).toEqual(projects)
  })
})

function setup() {
  const projectRepository = mock<ProjectRepository>()

  return {
    projectRepository,
    getProjectQry: new GetProjectsQry(projectRepository)
  }
}
