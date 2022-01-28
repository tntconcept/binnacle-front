import { mock } from 'jest-mock-extended'
import { LogoutAction } from 'modules/login/data-access/actions/logout-action'
import { MemoryTokenStorage } from 'shared/api/oauth/token-storage/memory-token-storage'
import { AppState } from 'shared/data-access/state/app-state'
import { container } from 'tsyringe'

describe('LogoutAction', () => {
  test('should logout', async () => {
    const { tokenStorage, appState, logoutAction } = setup()
    appState.isAuthenticated = true

    expect(appState.isAuthenticated).toBe(true)

    await logoutAction.execute()

    expect(appState.isAuthenticated).toBe(false)
    expect(tokenStorage.clearTokens).toHaveBeenCalled()
  })
})

function setup() {
  const tokenStorage = mock<MemoryTokenStorage>()
  const appState = container.resolve(AppState)

  return {
    tokenStorage,
    appState,
    logoutAction: new LogoutAction(appState, tokenStorage)
  }
}
