import httpClient from 'services/HttpClient'
import { formatDateForQuery } from 'utils/DateUtils'
import endpoints from 'api/endpoints'
import { ITimeBalanceApiResponse } from 'api/interfaces/ITimeBalance'

export async function fetchTimeBalanceBetweenDate(startDate: Date, endDate: Date) {
  return await httpClient
    .get(endpoints.timeBalance, {
      searchParams: {
        startDate: formatDateForQuery(startDate),
        endDate: formatDateForQuery(endDate)
      }
    })
    .json<ITimeBalanceApiResponse>()
}
