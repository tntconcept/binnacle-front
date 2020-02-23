import {fetchClient} from "services/FetchClient"
import {formatDateForQuery} from "utils/DateUtils"
import {TIME_TRACKER_ENDPOINT} from "services/endpoints"
import {ITimeTrackerResponse} from "interfaces/ITimeTracker"

export const getTimeBalanceBetweenDate = async (
  startDate: Date,
  endDate: Date
) => {
  return await fetchClient
    .get(TIME_TRACKER_ENDPOINT, {
      searchParams: {
        startDate: formatDateForQuery(startDate),
        endDate: formatDateForQuery(endDate)
      }
    })
    .json<ITimeTrackerResponse>();
};
