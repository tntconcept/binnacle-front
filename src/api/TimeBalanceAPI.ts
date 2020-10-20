import httpClient from 'services/HttpClient'
import endpoints from 'api/endpoints'
import { ITimeBalanceApiResponse } from 'api/interfaces/ITimeBalance'
import chrono from 'services/Chrono'

export async function fetchTimeBalanceBetweenDate(startDate: Date, endDate: Date) {
  return await httpClient
    .get(endpoints.timeBalance, {
      searchParams: {
        startDate: chrono(startDate).format(chrono.DATE_FORMAT),
        endDate: chrono(endDate).format(chrono.DATE_FORMAT)
      }
    })
    .json<ITimeBalanceApiResponse>()
}
