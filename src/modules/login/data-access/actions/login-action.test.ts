import { LoginAction } from 'modules/login/data-access/actions/login-action'
import { UserRepository } from 'modules/login/data-access/repositories/user-repository'
import type { User } from 'shared/api/users/User'
import { AppState } from 'shared/data-access/state/app-state'
import { container } from 'tsyringe'
import { mock } from 'jest-mock-extended'
import { OAuthRepository } from 'shared/api/oauth/oauth-repository'
import { TokenStorage } from 'shared/api/oauth/token-storage/token-storage'
import { buildOAuthResource } from 'test-utils/generateTestMocks'

describe('LoginAction', () => {
  test('should login', async () => {
    const user: User = { foo: '' } as any
    const { userRepository, oauthRepository, tokenStorage, appState, loginAction } = setup()

    const oauthResponse = buildOAuthResource()
    oauthRepository.getOAuthByUserCredentials.mockResolvedValue(oauthResponse)
    userRepository.getUser.mockResolvedValue(user)

    await loginAction.execute({ username: 'username', password: 'password' })

    expect(oauthRepository.getOAuthByUserCredentials).toHaveBeenCalledWith('username', 'password')
    expect(tokenStorage.setAccessToken).toHaveBeenCalledWith(oauthResponse.access_token)
    expect(tokenStorage.setRefreshToken).toHaveBeenCalledWith(oauthResponse.refresh_token)
    expect(userRepository.getUser).toHaveBeenCalledWith()
    expect(appState.isAuthenticated).toEqual(true)
    expect(appState.loggedUser).toEqual(user)
  })
})

function setup() {
  const userRepository = mock<UserRepository>()
  const oauthRepository = mock<OAuthRepository>()
  const tokenStorage = mock<TokenStorage>()
  const appState = container.resolve(AppState)

  return {
    userRepository,
    oauthRepository,
    tokenStorage,
    appState,
    loginAction: new LoginAction(userRepository, oauthRepository, appState, tokenStorage)
  }
}
