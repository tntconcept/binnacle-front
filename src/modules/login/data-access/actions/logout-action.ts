import { action, makeObservable, runInAction } from 'mobx'
import { AppState } from 'shared/data-access/state/app-state'
import { inject, singleton } from 'tsyringe'
import type { IAction } from 'shared/arch/interfaces/IAction'
import type { UserRepository } from '../interfaces/user-repository'
import { USER_REPOSITORY } from 'shared/data-access/ioc-container/ioc-container.tokens'

@singleton()
export class LogoutAction implements IAction {
  constructor(
    private appState: AppState,
    @inject(USER_REPOSITORY) private userRepository: UserRepository
  ) {
    makeObservable(this)
  }

  @action
  async execute(): Promise<void> {
    await this.userRepository.logout()

    runInAction(() => {
      this.appState.isAuthenticated = false
    })
  }
}
