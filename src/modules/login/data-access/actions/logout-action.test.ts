import { LogoutAction } from 'modules/login/data-access/actions/logout-action'
import { AppState } from 'shared/data-access/state/app-state'
import { container } from 'tsyringe'

describe('LogoutAction', () => {
  test('should logout', async () => {
    const { appState, logoutAction } = setup()
    appState.isAuthenticated = true

    expect(appState.isAuthenticated).toBe(true)

    await logoutAction.execute()

    expect(appState.isAuthenticated).toBe(false)
  })
})

function setup() {
  const appState = container.resolve(AppState)

  return {
    appState,
    logoutAction: new LogoutAction(appState)
  }
}
