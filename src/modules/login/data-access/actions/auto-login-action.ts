import { action, makeObservable, runInAction } from 'mobx'
import { inject, singleton } from 'tsyringe'
import type { IAction } from 'shared/arch/interfaces/IAction'
import type { TokenStorage } from 'shared/api/oauth/token-storage/token-storage'
import { OAuthRepository } from 'shared/api/oauth/oauth-repository'
import { AppState } from 'shared/data-access/state/app-state'
import { UserRepository } from 'modules/login/data-access/repositories/user-repository'

@singleton()
export class AutoLoginAction implements IAction<{ username: string; password: string }> {
  constructor(@inject('TokenStorage') private tokenStorage: TokenStorage, private oauthRepository: OAuthRepository, private appState: AppState, private userRepository: UserRepository) {
    makeObservable(this)
  }

  @action
  async execute(): Promise<void> {
    const refreshToken = await this.tokenStorage.getRefreshToken()

    if (refreshToken) {
      const oauthResponse = await this.oauthRepository.renewOAuthByRefreshToken(refreshToken)
      this.tokenStorage.setAccessToken(oauthResponse.access_token)
      await this.tokenStorage.setRefreshToken(oauthResponse.refresh_token)

      const user = await this.userRepository.getUser()

      runInAction(() => {
        this.appState.isAuthenticated = true
        this.appState.loggedUser = user
      })
    }
  }
}
