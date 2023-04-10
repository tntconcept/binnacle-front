import { mock } from 'jest-mock-extended'
import { UserRepository } from '../domain/user-repository'
import { LogoutCmd } from './logout-cmd'

describe('LogoutCmd', () => {
  it('should execute logout using the repository', async () => {
    const { userRepository, logoutCmd } = setup()

    await logoutCmd.internalExecute()

    expect(userRepository.logout).toBeCalled()
  })
})

function setup() {
  const userRepository = mock<UserRepository>()
  return {
    userRepository,
    logoutCmd: new LogoutCmd(userRepository)
  }
}
