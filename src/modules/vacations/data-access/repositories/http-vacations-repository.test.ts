import { mock } from 'jest-mock-extended'
import type {
  VacationPeriodRequest,
  VacationPeriodResponse
} from 'modules/vacations/data-access/vacation'
import type { VacationDetails } from 'modules/vacations/data-access/VacationDetails'
import endpoints from 'shared/api/endpoints'
import { HttpClient } from 'shared/data-access/http-client/http-client'
import type { Holidays } from 'shared/types/Holidays'
import { HttpVacationsRepository } from './http-vacations-repository'

describe('VacationRepository', () => {
  test('should get vacations by charge year', async () => {
    const holidays: Holidays = { foo: '' } as any
    const { httpClient, vacationsRepository } = setup()

    httpClient.get.mockResolvedValue(holidays)

    const result = await vacationsRepository.getVacationsByChargeYear(2020)

    expect(httpClient.get).toHaveBeenCalledWith(endpoints.vacations, {
      params: { chargeYear: 2020 }
    })
    expect(result).toEqual(holidays)
  })

  test('should get corresponding vacations days', async () => {
    const startDate = '2020-05-20'
    const endDate = '2020-05-21'
    const { httpClient, vacationsRepository } = setup()

    httpClient.get.mockResolvedValue(2)

    const result = await vacationsRepository.getCorrespondingVacationDays(startDate, endDate)

    expect(httpClient.get).toHaveBeenCalledWith(endpoints.vacationsDays, {
      params: {
        startDate: startDate,
        endDate: endDate
      }
    })
    expect(result).toEqual(2)
  })

  test('should get vacations details by charge year', async () => {
    const details: VacationDetails = { foo: '' } as any
    const { httpClient, vacationsRepository } = setup()

    httpClient.get.mockResolvedValue(details)

    const result = await vacationsRepository.getVacationDetailsByChargeYear(2020)

    expect(httpClient.get).toHaveBeenCalledWith(endpoints.vacationsDetails, {
      params: { chargeYear: 2020 }
    })
    expect(result).toEqual(details)
  })

  test('should create vacation period', async () => {
    const vacationPeriodResponse: VacationPeriodResponse[] = []
    const { httpClient, vacationsRepository } = setup()

    const vacationPeriodRequest: VacationPeriodRequest = {
      startDate: '2020-01-01',
      endDate: '2020-01-02',
      description: 'Lorem Ipsum'
    }

    httpClient.post.mockResolvedValue(vacationPeriodResponse)

    const result = await vacationsRepository.createVacationPeriod(vacationPeriodRequest)

    expect(httpClient.post).toHaveBeenCalledWith(endpoints.vacations, {
      id: undefined,
      startDate: '2020-01-01T00:00:00.000Z',
      endDate: '2020-01-02T00:00:00.000Z',
      description: 'Lorem Ipsum'
    })
    expect(result).toEqual(vacationPeriodResponse)
  })

  test('should update vacation period', async () => {
    const vacationPeriodResponse: VacationPeriodResponse[] = []
    const { httpClient, vacationsRepository } = setup()

    const vacationPeriodRequest: VacationPeriodRequest & { id: number } = {
      id: 100,
      startDate: '2020-01-01',
      endDate: '2020-01-02',
      description: 'Lorem Ipsum'
    }

    httpClient.put.mockResolvedValue(vacationPeriodResponse)

    const result = await vacationsRepository.updateVacationPeriod(vacationPeriodRequest)

    expect(httpClient.put).toHaveBeenCalledWith(endpoints.vacations, {
      id: 100,
      startDate: '2020-01-01T00:00:00.000Z',
      endDate: '2020-01-02T00:00:00.000Z',
      description: 'Lorem Ipsum'
    })
    expect(result).toEqual(vacationPeriodResponse)
  })

  test('should delete vacation period', async () => {
    const { httpClient, vacationsRepository } = setup()

    await vacationsRepository.deleteVacationPeriod(10)

    expect(httpClient.delete).toHaveBeenCalledWith(`${endpoints.vacations}/${10}`)
  })
})

function setup() {
  const httpClient = mock<HttpClient>()

  return {
    httpClient,
    vacationsRepository: new HttpVacationsRepository(httpClient)
  }
}
