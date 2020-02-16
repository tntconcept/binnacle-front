import {fetchClient} from "services/FetchClient"
import {formatDateForRequest} from "utils/DateUtils"
import {TIME_TRACKER_ENDPOINT} from "services/endpoints"
import {ITimeTrackerResponse} from "interfaces/ITimeTracker"

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
    .json<ITimeTrackerResponse>();
};
