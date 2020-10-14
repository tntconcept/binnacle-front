import HttpClient from 'services/HttpClient'
import {
  CreatePrivateHolidayPeriod,
  CreatePrivateHolidayResponse
} from './vacation.interfaces'

export default async function updateVacationPeriod(
  json: CreatePrivateHolidayPeriod
) {
  return await HttpClient.put('api/private-holidays', { json }).json<
    CreatePrivateHolidayResponse[]
  >()
}
