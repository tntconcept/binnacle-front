import { singleton } from 'tsyringe'
import { ApiVersionRepository } from '../repositories/api-version-repository'
import { action, makeObservable, runInAction } from 'mobx'
import { AppState } from '../../../../shared/data-access/state/app-state'

@singleton()
export class GetApiVersionAction {
  constructor(private apiVersionRepository: ApiVersionRepository, private appState: AppState) {
    makeObservable(this)
  }

  @action
  async execute(): Promise<void> {
    const apiVersion = await this.apiVersionRepository.getApiVersion()

    runInAction(() => {
      this.appState.apiVersion = apiVersion
    })
  }
}
