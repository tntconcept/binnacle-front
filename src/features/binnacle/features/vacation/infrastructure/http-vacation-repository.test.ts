import { mock } from 'jest-mock-extended'
import { HttpClient } from 'shared/http/http-client'
import { NewVacation } from '../domain/new-vacation'
import { UpdateVacation } from '../domain/update-vacation'
import { VacationGenerated } from '../domain/vacation-generated'
import { VacationSummary } from '../domain/vacation-summary'
import { HttpVacationRepository } from './http-vacation-repository'
import { DateInterval } from '../../../../../shared/types/date-interval'
import { VacationDto } from './vacation-dto'

describe('HttpVacationRepository', () => {
  test('should get vacations by charge year', async () => {
    const holidays: VacationDto[] = { vacations: [] } as any
    const { httpClient, vacationsRepository } = setup()

    httpClient.get.mockResolvedValue(holidays)

    const result = await vacationsRepository.getAll(2020)

    expect(httpClient.get).toHaveBeenCalledWith('/api/vacations', {
      params: { chargeYear: 2020 }
    })
    expect(result).toEqual([])
  })

  test('should get corresponding vacations days', async () => {
    const startDate = new Date('2020-05-20')
    const endDate = new Date('2020-05-21')
    const { httpClient, vacationsRepository } = setup()

    const dates: DateInterval = {
      start: startDate,
      end: endDate
    }

    httpClient.get.mockResolvedValue(2)

    const result = await vacationsRepository.getDaysForVacationPeriod(dates)

    expect(httpClient.get).toHaveBeenCalledWith('/api/vacations/days', {
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

    expect(httpClient.get).toHaveBeenCalledWith('/api/vacations/details', {
      params: { chargeYear: 2020 }
    })
    expect(result).toEqual(details)
  })

  test('should create vacation period', async () => {
    const vacationPeriodResponse: VacationGenerated[] = []
    const { httpClient, vacationsRepository } = setup()

    const vacationPeriodRequest: NewVacation = {
      startDate: new Date('2020-01-01'),
      endDate: new Date('2020-01-02'),
      description: 'Lorem Ipsum'
    }

    httpClient.post.mockResolvedValue(vacationPeriodResponse)

    const result = await vacationsRepository.create(vacationPeriodRequest)

    expect(httpClient.post).toHaveBeenCalledWith('/api/vacations', {
      startDate: '2020-01-01T01:00:00.000Z',
      endDate: '2020-01-02T01:00:00.000Z',
      description: 'Lorem Ipsum'
    })
    expect(result).toEqual(vacationPeriodResponse)
  })

  test('should update vacation period', async () => {
    const vacationPeriodResponse: VacationGenerated[] = []
    const { httpClient, vacationsRepository } = setup()

    const vacationPeriodRequest: UpdateVacation = {
      id: 100,
      startDate: new Date('2020-01-01'),
      endDate: new Date('2020-01-02'),
      description: 'Lorem Ipsum'
    }

    httpClient.put.mockResolvedValue(vacationPeriodResponse)

    const result = await vacationsRepository.update(vacationPeriodRequest)

    expect(httpClient.put).toHaveBeenCalledWith('/api/vacations', {
      id: 100,
      startDate: '2020-01-01T01:00:00.000Z',
      endDate: '2020-01-02T01:00:00.000Z',
      description: 'Lorem Ipsum'
    })
    expect(result).toEqual(vacationPeriodResponse)
  })

  test('should delete vacation period', async () => {
    const { httpClient, vacationsRepository } = setup()

    await vacationsRepository.delete(10)

    expect(httpClient.delete).toHaveBeenCalledWith('/api/vacations/10')
  })
})

function setup() {
  const httpClient = mock<HttpClient>()

  return {
    httpClient,
    vacationsRepository: new HttpVacationRepository(httpClient)
  }
}
