import {fetchClient} from "services/fetchClient"
import {HOLIDAYS_ENDPOINT} from "services/endpoints"
import {formatDateForRequest} from "utils/calendarUtils"

export interface IHolidayResponse {
  publicHolidays: Record<string, string[]>;
  privateHolidays: Record<string, string[]>;
}

export const getHolidaysBetweenDate = async (
  startDate: Date,
  endDate: Date
) => {
  return await fetchClient
    .url(HOLIDAYS_ENDPOINT)
    .query({
      startDate: formatDateForRequest(startDate),
      endDate: formatDateForRequest(endDate)
    })
    .get()
    .json<IHolidayResponse>()
}
