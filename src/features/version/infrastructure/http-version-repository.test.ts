import { describe, expect, test } from 'vitest'
import { mock } from 'vitest-mock-extended'
import { HttpClient } from '../../../shared/http/http-client'
import { HttpVersionRepository } from './http-version-repository'
import { VersionMother } from '../../../test-utils/mothers/version-mother'

describe('HttpVersionRepository', () => {
  test('should call http client for api version', async () => {
    const version: string = VersionMother.version()
    const { httpClient, httpVersionRepository } = setup()

    httpClient.get.mockResolvedValue(version)

    const result = await httpVersionRepository.getApiVersion()

    expect(httpClient.get).toHaveBeenCalled()
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
