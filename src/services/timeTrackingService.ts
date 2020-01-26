import {fetchClient} from "services/fetchClient"
import {formatDateForRequest} from "utils/calendarUtils"
import {TIME_TRACKER_ENDPOINT} from "services/endpoints"
import {ITimeTracker} from "interfaces/ITimeTracker"

export const getTimeBalanceBetweenDate = async (
  startDate: Date,
  endDate: Date
) => {
  return await fetchClient
    .url(TIME_TRACKER_ENDPOINT)
    .query({
      startDate: formatDateForRequest(startDate),
      endDate: formatDateForRequest(endDate)
    })
    .get()
    .json<ITimeTracker>();
};
