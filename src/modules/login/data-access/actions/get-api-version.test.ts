import { AppState } from 'shared/data-access/state/app-state'
import { container } from 'tsyringe'
import { mock } from 'jest-mock-extended'
import { ApiVersionRepository } from '../interfaces/api-version-repository'
import { GetApiVersionAction } from './get-api-version-action'

describe('GetApiVersionAction', () => {
  test('should get version', async () => {
    const version: string = '1.1.0' as any
    const { apiVersionRepository, appState, getApiVersionAction } = setup()
    apiVersionRepository.getApiVersion.mockResolvedValue(version)

    await getApiVersionAction.execute()

    expect(apiVersionRepository.getApiVersion).toHaveBeenCalledWith()
    expect(appState.apiVersion).toEqual(version)
  })
})

function setup() {
  const apiVersionRepository = mock<ApiVersionRepository>()
  const appState = container.resolve(AppState)

  return {
    apiVersionRepository,
    appState,
    getApiVersionAction: new GetApiVersionAction(apiVersionRepository, appState)
  }
}
