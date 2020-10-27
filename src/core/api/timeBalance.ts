import httpClient from 'core/services/HttpClient'
import endpoints from 'core/api/endpoints'
import { ITimeBalanceApiResponse } from 'core/api/interfaces'
import chrono from 'core/services/Chrono'

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
