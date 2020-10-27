import { CreateVacationPeriod, CreateVacationPeriodResponse } from 'core/api/vacation.interfaces'
import HttpClient from 'core/services/HttpClient'
import { IHolidays } from 'core/api/interfaces'
import { transformVacationResponse } from 'core/api/vacations.transformers'

export async function createVacationPeriod(json: CreateVacationPeriod) {
  return await HttpClient.post('api/vacations', { json }).json<CreateVacationPeriodResponse[]>()
}

export async function deleteVacationPeriod(id: number) {
  await HttpClient.delete(`api/vacations/${id}`).text()
}

export async function fetchCorrespondingPrivateHolidayDays(
  startDate: ISO8601Date,
  endDate: ISO8601Date
): Promise<number> {
  return await HttpClient.get('api/vacations/days', {
    searchParams: {
      startDate: startDate,
      endDate: endDate
    }
  }).json<number>()
}

export async function fetchHolidaysByChargeYear(chargeYear: number): Promise<IHolidays> {
  const response = await HttpClient.get('api/vacations', {
    searchParams: {
      chargeYear: chargeYear
    }
  }).json<IHolidays>()

  return (transformVacationResponse(response) as unknown) as IHolidays
}

export async function updateVacationPeriod(json: CreateVacationPeriod) {
  return await HttpClient.put('api/vacations', { json }).json<CreateVacationPeriodResponse[]>()
}
