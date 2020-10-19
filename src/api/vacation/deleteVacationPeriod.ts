import HttpClient from 'services/HttpClient'

export default async function deleteVacationPeriod(id: number) {
  await HttpClient.delete(`api/vacations/${id}`).text()
}
