import { mock } from 'jest-mock-extended'
import { HttpClient } from 'shared/http/http-client'
import { HttpActivityRepository } from './http-activity-repository'
import { ActivityMother } from '../../../../../test-utils/mothers/activity-mother'
import { Base64Converter } from '../../../../../shared/base64/base64-converter'
import chrono, { parseISO } from '../../../../../shared/utils/chrono'
import { DateInterval } from '../../../../../shared/types/date-interval'

describe('HttpActivityRepository', () => {
  test('should call http client for activities', async () => {
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

  test('should return the number of days given a start date & an end date', async () => {
    const startDate = new Date('2023-05-19')
    const endDate = new Date('2023-05-22')
    const { httpClient, httpActivityRepository } = setup()

    const dates: DateInterval = {
      start: startDate,
      end: endDate
    }

    httpClient.get.mockResolvedValue(2)

    const result = await httpActivityRepository.getDaysForActivityDaysPeriod(dates)

    expect(httpClient.get).toHaveBeenCalledWith('/api/calendar/workable-days/count', {
      params: {
        endDate: chrono(endDate).format(chrono.DATE_FORMAT),
        startDate: chrono(startDate).format(chrono.DATE_FORMAT)
      }
    })
    expect(result).toEqual(2)
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
