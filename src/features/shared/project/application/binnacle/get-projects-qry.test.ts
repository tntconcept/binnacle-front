import { mock } from 'jest-mock-extended'
import { GetProjectsQry } from './get-projects-qry'
import { ProjectRepository } from '../domain/project-repository'
import { ProjectMother } from '../../../../../test-utils/mothers/project-mother'
import { OrganizationMother } from '../../../../../test-utils/mothers/organization-mother'

describe('GetProjectsQry', () => {
  it('should get projects from repository', async () => {
    const { getProjectQry, projectRepository } = setup()
    const projects = ProjectMother.projects()
    projectRepository.getAll.mockResolvedValue(projects)

    const response = await getProjectQry.internalExecute(OrganizationMother.organization().id)

    expect(projectRepository.getAll).toHaveBeenCalled()
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
