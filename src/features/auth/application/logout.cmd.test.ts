import { mock } from 'jest-mock-extended'
import { AuthRepository } from '../domain/auth-repository'
import { LogoutCmd } from './logout.cmd'

describe('LogoutCmd', () => {
  it('should execute logout using the repository', async () => {
    const { userRepository, logoutCmd } = setup()

    await logoutCmd.internalExecute()

    expect(userRepository.logout).toBeCalled()
  })
})

function setup() {
  const userRepository = mock<AuthRepository>()
  return {
    userRepository,
    logoutCmd: new LogoutCmd(userRepository)
  }
}
