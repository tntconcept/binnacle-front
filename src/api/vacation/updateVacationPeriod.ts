import HttpClient from 'services/HttpClient'
import endpoints from 'api/endpoints'
import { PrivateHolidayRequestBody } from './vacation.interfaces'

export default async function updateVacationPeriod(json: PrivateHolidayRequestBody) {
  await HttpClient.put(endpoints.holidays, { json }).json()
}
