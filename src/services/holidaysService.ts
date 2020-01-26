import {fetchClient} from "services/fetchClient"
import {HOLIDAYS_ENDPOINT} from "services/endpoints"
import {formatDateForRequest} from "utils/calendarUtils"
import {IHolidaysResponse} from "interfaces/IHolidays"

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
    .json<IHolidaysResponse>()
}
