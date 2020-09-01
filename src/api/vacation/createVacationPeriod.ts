import HttpClient from 'services/HttpClient'
import endpoints from 'api/endpoints'
import { PrivateHolidayRequestBody } from './interfaces'

export default async function createVacationPeriod(data: PrivateHolidayRequestBody) {
  await HttpClient.post(endpoints.holidays, {
    json: data
  }).json()
}
