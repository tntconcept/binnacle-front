import httpClient from "api/HttpClient"
import {formatDateForQuery} from "utils/DateUtils"
import endpoints from "api/endpoints"
import {ITimeBalanceResponse} from "api/interfaces/ITimeBalance"

export const getTimeBalanceBetweenDate = async (
  startDate: Date,
  endDate: Date
) => {
  return await httpClient
    .get(endpoints.timeBalance, {
      searchParams: {
        startDate: formatDateForQuery(startDate),
        endDate: formatDateForQuery(endDate)
      }
    })
    .json<ITimeBalanceResponse>();
};
