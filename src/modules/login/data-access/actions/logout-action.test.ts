import { mock } from 'jest-mock-extended'
import { LogoutAction } from 'modules/login/data-access/actions/logout-action'
import { AppState } from 'shared/data-access/state/app-state'
import { container } from 'tsyringe'
import { UserRepository } from '../repositories/user-repository'

describe('LogoutAction', () => {
  test('should logout', async () => {
    const { appState, logoutAction, userRepository } = setup()
    appState.isAuthenticated = true

    expect(appState.isAuthenticated).toBe(true)

    await logoutAction.execute()

    expect(appState.isAuthenticated).toBe(false)
    expect(userRepository.logout).toHaveBeenCalled()
  })
})

function setup() {
  const appState = container.resolve(AppState)
  const userRepository = mock<UserRepository>()

  return {
    appState,
    userRepository,
    logoutAction: new LogoutAction(appState, userRepository)
  }
}
