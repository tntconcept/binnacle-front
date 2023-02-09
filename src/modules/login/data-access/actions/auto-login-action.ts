import { action, makeObservable, runInAction } from 'mobx'
import { singleton } from 'tsyringe'
import type { IAction } from 'shared/arch/interfaces/IAction'
import { AppState } from 'shared/data-access/state/app-state'
import { UserRepository } from 'modules/login/data-access/repositories/user-repository'
import { AnonymousUserError } from '../errors/anonymous-user-error'

@singleton()
export class AutoLoginAction implements IAction<{ username: string; password: string }> {
  constructor(private appState: AppState, private userRepository: UserRepository) {
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
