import { mock } from 'jest-mock-extended'
import { AuthRepository } from '../domain/auth-repository'
import { LoginCmd } from './login-cmd'

describe('LoginCmd', () => {
  it('should execute login using the repository', async () => {
    const { userRepository, loginCmd } = setup()

    await loginCmd.internalExecute({ username: 'foo', password: 'password' })

    expect(userRepository.login).toHaveBeenCalledWith({ username: 'foo', password: 'password' })
  })
})

function setup() {
  const userRepository = mock<AuthRepository>()
  return {
    userRepository,
    loginCmd: new LoginCmd(userRepository)
  }
}
