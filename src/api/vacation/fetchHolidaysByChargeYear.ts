import { IHolidays } from 'api/interfaces/IHolidays'
import HttpClient from 'services/HttpClient'
import { transformVacationResponse } from './vacation.transformers'

export async function fetchHolidaysByChargeYear(chargeYear: number): Promise<IHolidays> {
  const response = await HttpClient.get('api/vacations', {
    searchParams: {
      chargeYear: chargeYear
    }
  }).json<IHolidays>()

  return (transformVacationResponse(response) as unknown) as IHolidays
}
