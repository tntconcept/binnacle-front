import { IHolidays } from 'api/interfaces/IHolidays'
import HttpClient from 'services/HttpClient'
import { transformHolidaysResponse } from './vacation.transformers'

export async function fetchHolidaysByChargeYear(
  chargeYear: number
): Promise<IHolidays> {
  const response = await HttpClient.get('api/private-holidays', {
    searchParams: {
      chargeYear: chargeYear
    }
  }).json<IHolidays>()

  return (transformHolidaysResponse(response) as unknown) as IHolidays
}
