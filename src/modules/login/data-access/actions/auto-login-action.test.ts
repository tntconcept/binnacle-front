import { AppState } from 'shared/data-access/state/app-state'
import { container } from 'tsyringe'
import { mock } from 'jest-mock-extended'
import { UserRepository } from '../interfaces/user-repository'
import { AutoLoginAction } from './auto-login-action'
import { buildUser } from 'test-utils/generateTestMocks'
import { AnonymousUserError } from '../errors/anonymous-user-error'

describe('AutoLoginAction', () => {
  test('should set loggedUser state when repository return the user', async () => {
    const { appState, userRepository, autoLoginAction } = setup()
    userRepository.getUser.mockResolvedValue(buildUser())
    appState.loggedUser = undefined

    await autoLoginAction.execute()

    expect(appState.loggedUser).toEqual(buildUser())
  })

  test('should set isAuthenticated state when repository return the user', async () => {
    const { appState, userRepository, autoLoginAction } = setup()
    userRepository.getUser.mockResolvedValue(buildUser())
    appState.isAuthenticated = false

    await autoLoginAction.execute()

    expect(appState.isAuthenticated).toBeTruthy()
  })

  test('should throw error when error is not AnonymousUserError', async () => {
    const { userRepository, autoLoginAction } = setup()
    userRepository.getUser.mockRejectedValue(new Error())

    expect(autoLoginAction.execute()).rejects.toThrowError()
  })

  test('should not throw error when error is AnonymousUserError', async () => {
    const { userRepository, autoLoginAction } = setup()
    userRepository.getUser.mockRejectedValue(new AnonymousUserError())

    expect(autoLoginAction.execute()).resolves.not.toThrowError()
  })
})

function setup() {
  const userRepository = mock<UserRepository>()
  const appState = container.resolve(AppState)

  return {
    userRepository,
    appState,
    autoLoginAction: new AutoLoginAction(appState, userRepository)
  }
}
