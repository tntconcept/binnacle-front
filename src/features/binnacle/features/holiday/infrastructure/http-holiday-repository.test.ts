import { mock } from 'jest-mock-extended'
import { HolidayMother } from '../../../../../test-utils/mothers/holiday-mother'
import { HttpClient } from '../../../../../shared/http/http-client'
import { HttpHolidayRepository } from './http-holiday-repository'

describe('HttpHolidayRepository', () => {
  it('should retrieve march holidays from repository and parse dates', async () => {
    const { httpClient, httpHolidayRepository } = setup()
    const start = HolidayMother.marchHolidays().at(0)!.date
    const end = HolidayMother.marchHolidays().at(-1)!.date
    httpClient.get.mockResolvedValue({ holidays: HolidayMother.serializedMarchHolidays() })

    const result = await httpHolidayRepository.getAll({ start, end })

    expect(httpClient.get).toHaveBeenCalled()
    expect(result).toEqual(HolidayMother.marchHolidays())
  })
})

function setup() {
  const httpClient = mock<HttpClient>()

  return {
    httpClient,
    httpHolidayRepository: new HttpHolidayRepository(httpClient)
  }
}
