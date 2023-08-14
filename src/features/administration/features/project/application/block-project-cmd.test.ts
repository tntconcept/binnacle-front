import { describe, expect, it } from 'vitest'
import { mock } from 'vitest-mock-extended'
import { ProjectRepository } from '../domain/project-repository'
import { BlockProjectCmd } from './block-project-cmd'

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
