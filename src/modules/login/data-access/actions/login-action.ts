import { action, makeObservable, runInAction } from 'mobx'
import { UserRepository } from 'modules/login/data-access/repositories/user-repository'
import { AppState } from 'shared/data-access/state/app-state'
import { inject, singleton } from 'tsyringe'
import type { IAction } from 'shared/arch/interfaces/IAction'
import { OAuthRepository } from 'shared/api/oauth/oauth-repository'
import type { TokenStorage } from 'shared/api/oauth/token-storage/token-storage'

@singleton()
export class LoginAction implements IAction<{ username: string; password: string }> {
  constructor(private userRepository: UserRepository, private oauthRepository: OAuthRepository, private appState: AppState, @inject('TokenStorage') private tokenStorage: TokenStorage) {
    makeObservable(this)
  }

  @action
  async execute(param: { username: string; password: string }): Promise<void> {
    const oauthResponse = await this.oauthRepository.getOAuthByUserCredentials(param.username, param.password)
    this.tokenStorage.setAccessToken(oauthResponse.access_token)
    await this.tokenStorage.setRefreshToken(oauthResponse.refresh_token)
    
    const user = await this.userRepository.getUser()

    runInAction(() => {
      this.appState.isAuthenticated = true
      this.appState.loggedUser = user
    })
  }
}
