import { axiosClient } from "services/axiosClient";
import { TIME_TRACKER_ENDPOINT } from "services/endpoints";

export const getTimeBalanceBetweenDate = async (
  startDate: Date,
  endDate: Date
) => {
  return await axiosClient.get(TIME_TRACKER_ENDPOINT, {
    params: {
      // TODO PARSE CORRECTLY THE DATE
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    }
  });
};
