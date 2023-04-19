import { mock } from 'jest-mock-extended'
import { HttpClient } from 'shared/http/http-client'
import { HttpActivityRepository } from './http-activity-repository'
import { ActivityMother } from '../../../../../test-utils/mothers/activity-mother'

describe('HttpActivityRepository', () => {
  test('', async () => {
    const { httpClient, httpActivityRepository } = setup()
    const start = ActivityMother.marchActivitySummary().at(0)!.date
    const end = ActivityMother.marchActivitySummary().at(-1)!.date
    httpClient.get.mockResolvedValue(ActivityMother.serializedMarchActivitySummary())

    const result = await httpActivityRepository.getActivitySummary({ start, end })

    expect(httpClient.get).toHaveBeenCalledWith()
    expect(result).toEqual(ActivityMother.marchActivitySummary())
  })
})

function setup() {
  const httpClient = mock<HttpClient>()

  return {
    httpClient,
    httpActivityRepository: new HttpActivityRepository(httpClient)
  }
}
