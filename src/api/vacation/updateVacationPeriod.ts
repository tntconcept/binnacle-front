import HttpClient from 'services/HttpClient'
import { CreateVacationPeriod, CreateVacationPeriodResponse } from './vacation.interfaces'

export default async function updateVacationPeriod(json: CreateVacationPeriod) {
  return await HttpClient.put('api/vacations', { json }).json<CreateVacationPeriodResponse[]>()
}
