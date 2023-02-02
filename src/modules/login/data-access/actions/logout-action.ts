import { action, makeObservable, runInAction } from 'mobx'
import { AppState } from 'shared/data-access/state/app-state'
import { singleton } from 'tsyringe'
import type { IAction } from 'shared/arch/interfaces/IAction'

@singleton()
export class LogoutAction implements IAction {
  constructor(private appState: AppState) {
    makeObservable(this)
  }

  @action
  async execute(): Promise<void> {
    runInAction(() => {
      this.appState.isAuthenticated = false
    })
  }
}
