import HttpClient from 'services/HttpClient'
import { VacationStats } from './interfaces'

export default async function fetchVacationStatsByYear(year: string | number) {
  return await HttpClient
    .get('api/vacation?year=' + year)
    .json<VacationStats>()
}
