import { mock } from 'jest-mock-extended'
import endpoints from 'shared/api/endpoints'
import { HttpClient } from 'shared/data-access/http-client/http-client'
import { HttpApiVersionRepository } from './http-api-version-repository'

describe('HttpApiVersionRepository', () => {
  test('should get the api version', async () => {
    const version: string = '1.0.1' as any
    const { httpClient, versionService } = setup()

    httpClient.get.mockResolvedValue(version)

    const result = await versionService.getApiVersion()

    expect(httpClient.get).toHaveBeenCalledWith(endpoints.version)
    expect(result).toEqual(version)
  })
})

function setup() {
  const httpClient = mock<HttpClient>()

  return {
    httpClient,
    versionService: new HttpApiVersionRepository(httpClient)
  }
}
