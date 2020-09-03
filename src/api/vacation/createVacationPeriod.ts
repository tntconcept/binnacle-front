import HttpClient from 'services/HttpClient'
import endpoints from 'api/endpoints'
import { PrivateHolidayRequestBody } from './interfaces'

export default async function createVacationPeriod(json: PrivateHolidayRequestBody) {
  await HttpClient.post(endpoints.holidays, { json }).json()
}
