import { axiosClient } from "services/axiosClient";
import { ACTIVITIES_ENDPOINT } from "services/endpoints";

export const getActivitiesBetweenDate = async (
  startDate: Date,
  endDate: Date
) => {
  return await axiosClient.get(ACTIVITIES_ENDPOINT, {
    params: {
      // TODO PARSE CORRECTLY THE DATE
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    }
  });
};
