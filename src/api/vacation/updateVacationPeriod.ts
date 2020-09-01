import HttpClient from 'services/HttpClient'
import endpoints from 'api/endpoints'
import { PrivateHolidayRequestBody } from './interfaces'

export default async function updateVacationPeriod(data: PrivateHolidayRequestBody) {
  await HttpClient.put(endpoints.holidays, {
    json: data
  }).json()
}
