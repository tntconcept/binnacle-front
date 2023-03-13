import { inject, singleton } from 'tsyringe'
import type { ApiVersionRepository } from '../interfaces/api-version-repository'
import { action, makeObservable, runInAction } from 'mobx'
import { AppState } from '../../../../shared/data-access/state/app-state'
import { API_VERSION_REPOSITORY } from 'shared/data-access/ioc-container/ioc-container.tokens'

@singleton()
export class GetApiVersionAction {
  constructor(
    @inject(API_VERSION_REPOSITORY) private apiVersionRepository: ApiVersionRepository,
    private appState: AppState
  ) {
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
