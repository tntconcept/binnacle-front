import HttpClient from 'services/HttpClient'
import endpoints from 'api/endpoints'
import { PrivateHolidayRequestBody } from './vacation.interfaces'

export default async function createVacationPeriod(json: PrivateHolidayRequestBody) {
  await HttpClient.post(endpoints.holidays, { json }).json()
}
