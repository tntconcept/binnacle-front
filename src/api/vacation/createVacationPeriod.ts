import HttpClient from 'services/HttpClient'
import { CreateVacationPeriod, CreateVacationPeriodResponse } from './vacation.interfaces'

export default async function createVacationPeriod(json: CreateVacationPeriod) {
  return await HttpClient.post('api/vacations', { json }).json<CreateVacationPeriodResponse[]>()
}
