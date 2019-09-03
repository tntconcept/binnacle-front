import { axiosClient } from "services/axiosClient";
import { TIME_TRACKER_ENDPOINT } from "services/endpoints";
import { formatDateForRequest } from "utils/calendarUtils";

export interface ITimeTracker {
  minutesToWork: number;
  minutesWorked: number;
  differenceInMinutes: number;
}

export const getTimeBalanceBetweenDate = async (
  startDate: Date,
  endDate: Date
) => {
  return await axiosClient.get<Record<string, ITimeTracker>>(
    TIME_TRACKER_ENDPOINT,
    {
      params: {
        startDate: formatDateForRequest(startDate),
        endDate: formatDateForRequest(endDate)
      }
    }
  );
};
