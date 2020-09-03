import endpoints from 'api/endpoints'
import { IHolidays } from 'api/interfaces/IHolidays'
import HttpClient from 'services/HttpClient'
import { transformHolidaysResponse } from './transformers'

export async function fetchHolidaysByChargeYear(
  startDate: ISO8601Date,
  endDate: ISO8601Date,
  chargeYear: ISO8601Date
): Promise<IHolidays> {
  const response = await HttpClient.get(endpoints.holidays, {
    searchParams: {
      startDate: startDate,
      endDate: endDate,
      chargeYear: chargeYear
    }
  }).json<IHolidays>()

  return transformHolidaysResponse(response)
}
