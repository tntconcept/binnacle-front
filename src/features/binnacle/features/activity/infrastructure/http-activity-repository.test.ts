import { mock } from 'jest-mock-extended'
import { HttpClient } from 'shared/http/http-client'
import { HttpActivityRepository } from './http-activity-repository'
import { ActivityMother } from '../../../../../test-utils/mothers/activity-mother'
import { Base64Converter } from '../../../../../shared/base64/base64-converter'
import chrono, { parseISO } from '../../../../../shared/utils/chrono'

describe('HttpActivityRepository', () => {
  it('should call http client for activities', async () => {
    const { httpClient, httpActivityRepository } = setup()
    const start = ActivityMother.marchActivitySummary().at(0)!.date
    const end = ActivityMother.marchActivitySummary().at(-1)!.date
    httpClient.get.mockResolvedValue(ActivityMother.serializedMarchActivitySummary())

    const result = await httpActivityRepository.getActivitySummary({ start, end })

    const parsedSummary = ActivityMother.marchActivitySummary().map((x) => {
      return {
        date: parseISO(chrono(x.date).format(chrono.DATE_FORMAT)),
        worked: x.worked
      }
    })

    expect(httpClient.get).toHaveBeenCalledWith('/api/activity/summary', {
      params: {
        endDate: chrono(end).format(chrono.DATE_FORMAT),
        startDate: chrono(start).format(chrono.DATE_FORMAT)
      }
    })
    expect(result).toEqual(parsedSummary)
  })

  it('should call http client for approve an activity', async () => {
    const { httpClient, httpActivityRepository } = setup()
    const id = 1

    await httpActivityRepository.setApproved(id)

    expect(httpClient.post).toHaveBeenCalledWith('/api/activity/1/approve')
  })
})

function setup() {
  const httpClient = mock<HttpClient>()
  const base64Converter = mock<Base64Converter>()

  return {
    httpClient,
    httpActivityRepository: new HttpActivityRepository(httpClient, base64Converter)
  }
}
