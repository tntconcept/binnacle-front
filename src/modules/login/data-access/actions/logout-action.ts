import { action, makeObservable, runInAction } from 'mobx'
import { AppState } from 'shared/data-access/state/app-state'
import { singleton } from 'tsyringe'
import type { IAction } from 'shared/arch/interfaces/IAction'
import { UserRepository } from '../repositories/user-repository'

@singleton()
export class LogoutAction implements IAction {
  constructor(private appState: AppState, private userRepository: UserRepository) {
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
