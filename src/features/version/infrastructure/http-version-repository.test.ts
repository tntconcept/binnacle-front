import { mock } from 'jest-mock-extended'
import { HttpClient } from 'shared/http/http-client'
import { HttpVersionRepository } from './http-version-repository'

describe('HttpVersionRepository', () => {
  test('should get the api version', async () => {
    const version: string = '1.0.1' as any
    const { httpClient, httpVersionRepository } = setup()

    httpClient.get.mockResolvedValue(version)

    const result = await httpVersionRepository.getApiVersion()

    expect(httpClient.get).toHaveBeenCalledWith()
    expect(result).toEqual(version)
  })
})

function setup() {
  const httpClient = mock<HttpClient>()

  return {
    httpClient,
    httpVersionRepository: new HttpVersionRepository(httpClient)
  }
}
