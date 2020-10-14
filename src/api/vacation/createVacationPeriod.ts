import HttpClient from 'services/HttpClient'
import {
  CreatePrivateHolidayPeriod,
  CreatePrivateHolidayResponse
} from './vacation.interfaces'

export default async function createVacationPeriod(
  json: CreatePrivateHolidayPeriod
) {
  return await HttpClient.post('api/private-holidays', { json }).json<
    CreatePrivateHolidayResponse[]
  >()
}
