import { mock } from 'jest-mock-extended'
import { BlockProjectCmd } from './block-project-cmd'
import { ProjectRepository } from '../domain/project-repository'

describe('BlockProjectCmd', () => {
  it('should block a project', async () => {
    const { blockProjectCmd, projectRepository } = setup()
    const projectWithDate = {
      projectId: 1,
      date: new Date()
    }

    await blockProjectCmd.internalExecute(projectWithDate)

    expect(projectRepository.setBlock).toBeCalledWith(projectWithDate)
  })
})

function setup() {
  const projectRepository = mock<ProjectRepository>()

  return {
    blockProjectCmd: new BlockProjectCmd(projectRepository),
    projectRepository
  }
}
