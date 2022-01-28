import { action, makeObservable, runInAction } from 'mobx'
import type { TokenStorage } from 'shared/api/oauth/token-storage/token-storage'
import { AppState } from 'shared/data-access/state/app-state'
import { inject, singleton } from 'tsyringe'
import type { IAction } from 'shared/arch/interfaces/IAction'

@singleton()
export class LogoutAction implements IAction {
  constructor(
    private appState: AppState,
    @inject('TokenStorage') private tokenStorage: TokenStorage
  ) {
    makeObservable(this)
  }

  @action
  async execute(): Promise<void> {
    await this.tokenStorage.clearTokens()
    runInAction(() => {
        this.appState.isAuthenticated = false
      }
    )
  }
}
