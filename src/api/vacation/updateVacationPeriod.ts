import HttpClient from 'services/HttpClient'
import endpoints from 'api/endpoints'

export default async function updateVacationPeriod(data: any) {
  await HttpClient.put(endpoints.holidays, {
    json: data
  }).json()
}
