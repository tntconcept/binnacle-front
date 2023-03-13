import { action, makeObservable, runInAction } from 'mobx'
import { inject, singleton } from 'tsyringe'
import type { IAction } from 'shared/arch/interfaces/IAction'
import { AppState } from 'shared/data-access/state/app-state'
import type { UserRepository } from 'modules/login/data-access/interfaces/user-repository'
import { AnonymousUserError } from '../errors/anonymous-user-error'
import { USER_REPOSITORY } from 'shared/data-access/ioc-container/ioc-container.tokens'

@singleton()
export class AutoLoginAction implements IAction<{ username: string; password: string }> {
  constructor(
    private appState: AppState,
    @inject(USER_REPOSITORY) private userRepository: UserRepository
  ) {
    makeObservable(this)
  }

  @action
  async execute(): Promise<void> {
    try {
      const user = await this.userRepository.getUser()

      if (user) {
        runInAction(() => {
          this.appState.isAuthenticated = true
          this.appState.loggedUser = user
        })
      }
    } catch (error) {
      const isAnonymousUser = error instanceof AnonymousUserError
      if (!isAnonymousUser) {
        throw error
      }
    }
  }
}
