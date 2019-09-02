import { axiosClient } from "services/axiosClient";
import { HOLIDAYS_ENDPOINT } from "services/endpoints";

export const getHolidaysBetweenDate = async (
  startDate: Date,
  endDate: Date
) => {
  return await axiosClient.get(HOLIDAYS_ENDPOINT, {
    params: {
      // TODO PARSE CORRECTLY THE DATE
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    }
  });
};
