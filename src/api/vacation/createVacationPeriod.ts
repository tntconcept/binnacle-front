import HttpClient from 'services/HttpClient'
import endpoints from 'api/endpoints'

export default async function createVacationPeriod(data: any) {
  await HttpClient.post(endpoints.holidays, {
    json: data
  }).json()
}
