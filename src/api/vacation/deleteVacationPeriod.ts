import HttpClient from 'services/HttpClient'
import endpoints from 'api/endpoints'

export default async function deleteVacationPeriod(id: number) {
  await HttpClient.delete(`api/private-holidays/${id}`).text()
}
