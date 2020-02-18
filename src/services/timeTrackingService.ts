import {fetchClient} from "services/FetchClient"
import {formatDateForQuery} from "utils/DateUtils"
import {TIME_TRACKER_ENDPOINT} from "services/endpoints"
import {ITimeTrackerResponse} from "interfaces/ITimeTracker"

export const getTimeBalanceBetweenDate = async (
  startDate: Date,
  endDate: Date
) => {
  return await fetchClient
    .url(TIME_TRACKER_ENDPOINT)
    .query({
      startDate: formatDateForQuery(startDate),
      endDate: formatDateForQuery(endDate)
    })
    .get()
    .json<ITimeTrackerResponse>();
};
