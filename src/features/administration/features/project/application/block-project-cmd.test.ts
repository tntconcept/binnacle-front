import { mock } from 'jest-mock-extended'
import { BlockProjectCmd } from './block-project-cmd'
import { ProjectRepository } from '../../../../shared/project/domain/project-repository'

describe('BlockProjectCmd', () => {
  it('should block a project', async () => {
    const { blockProjectCmd, projectRepository } = setup()
    const projectId = 1
    const date = new Date()

    await blockProjectCmd.internalExecute({ projectId, date })

    expect(projectRepository.blockProject).toBeCalledWith(projectId, date)
  })
})

function setup() {
  const projectRepository = mock<ProjectRepository>()

  return {
    blockProjectCmd: new BlockProjectCmd(projectRepository),
    projectRepository
  }
}
