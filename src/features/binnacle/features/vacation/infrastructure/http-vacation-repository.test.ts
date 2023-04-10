import { mock } from 'jest-mock-extended'
import { HttpClient } from 'shared/http/http-client'
import type { Holidays } from 'shared/types/Holidays'
import { NewVacation } from '../domain/new-vacation'
import { UpdateVacation } from '../domain/update-vacation'
import { VacationGenerated } from '../domain/vacation-generated'
import { VacationSummary } from '../domain/vacation-summary'
import { HttpVacationRepository } from './http-vacation-repository'

describe('HttpVacationRepository', () => {
  test('should get vacations by charge year', async () => {
    const holidays: Holidays = { foo: '' } as any
    const { httpClient, vacationsRepository } = setup()

    httpClient.get.mockResolvedValue(holidays)

    const result = await vacationsRepository.getAll(2020)

    expect(httpClient.get).toHaveBeenCalledWith('/vacations', {
      params: { chargeYear: 2020 }
    })
    expect(result).toEqual(holidays)
  })

  test('should get corresponding vacations days', async () => {
    const startDate = '2020-05-20'
    const endDate = '2020-05-21'
    const { httpClient, vacationsRepository } = setup()

    httpClient.get.mockResolvedValue(2)

    const result = await vacationsRepository.getDaysForVacationPeriod(startDate, endDate)

    expect(httpClient.get).toHaveBeenCalledWith('/vacations/days', {
      params: {
        startDate: startDate,
        endDate: endDate
      }
    })
    expect(result).toEqual(2)
  })

  test('should get vacations details by charge year', async () => {
    const details: VacationSummary = { foo: '' } as any
    const { httpClient, vacationsRepository } = setup()

    httpClient.get.mockResolvedValue(details)

    const result = await vacationsRepository.getVacationSummary(2020)

    expect(httpClient.get).toHaveBeenCalledWith('/vacations/details', {
      params: { chargeYear: 2020 }
    })
    expect(result).toEqual(details)
  })

  test('should create vacation period', async () => {
    const vacationPeriodResponse: VacationGenerated[] = []
    const { httpClient, vacationsRepository } = setup()

    const vacationPeriodRequest: NewVacation = {
      startDate: '2020-01-01',
      endDate: '2020-01-02',
      description: 'Lorem Ipsum'
    }

    httpClient.post.mockResolvedValue(vacationPeriodResponse)

    const result = await vacationsRepository.create(vacationPeriodRequest)

    expect(httpClient.post).toHaveBeenCalledWith('/vacations', {
      id: undefined,
      startDate: '2020-01-01T00:00:00.000Z',
      endDate: '2020-01-02T00:00:00.000Z',
      description: 'Lorem Ipsum'
    })
    expect(result).toEqual(vacationPeriodResponse)
  })

  test('should update vacation period', async () => {
    const vacationPeriodResponse: VacationGenerated[] = []
    const { httpClient, vacationsRepository } = setup()

    const vacationPeriodRequest: UpdateVacation = {
      id: 100,
      startDate: '2020-01-01',
      endDate: '2020-01-02',
      description: 'Lorem Ipsum'
    }

    httpClient.put.mockResolvedValue(vacationPeriodResponse)

    const result = await vacationsRepository.update(vacationPeriodRequest)

    expect(httpClient.put).toHaveBeenCalledWith('/vacations', {
      id: 100,
      startDate: '2020-01-01T00:00:00.000Z',
      endDate: '2020-01-02T00:00:00.000Z',
      description: 'Lorem Ipsum'
    })
    expect(result).toEqual(vacationPeriodResponse)
  })

  test('should delete vacation period', async () => {
    const { httpClient, vacationsRepository } = setup()

    await vacationsRepository.delete(10)

    expect(httpClient.delete).toHaveBeenCalledWith('/vacations/10')
  })
})

function setup() {
  const httpClient = mock<HttpClient>()

  return {
    httpClient,
    vacationsRepository: new HttpVacationRepository(httpClient)
  }
}
