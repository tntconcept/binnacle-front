import { mock } from 'jest-mock-extended'
import { ProjectRepository } from '../domain/project-repository'
import { UnblockProjectCmd } from './unblock-project.cmd'

describe('UnblockProjectCmd', () => {
  it('should unblock a project', async () => {
    const { unblockProjectCmd, projectRepository } = setup()
    const id = 1

    await unblockProjectCmd.internalExecute(id)

    expect(projectRepository.setUnblock).toBeCalledWith(id)
  })
})

function setup() {
  const projectRepository = mock<ProjectRepository>()

  return {
    unblockProjectCmd: new UnblockProjectCmd(projectRepository),
    projectRepository
  }
}
