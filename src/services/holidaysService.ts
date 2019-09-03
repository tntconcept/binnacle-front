import { axiosClient } from "services/axiosClient";
import { HOLIDAYS_ENDPOINT } from "services/endpoints";
import { formatDateForRequest } from "utils/calendarUtils";

interface IHolidayResponse {
  publicHolidays: Record<string, string[]>;
  privateHolidays: Record<string, string[]>;
}

export const getHolidaysBetweenDate = async (
  startDate: Date,
  endDate: Date
) => {
  return await axiosClient.get<IHolidayResponse>(HOLIDAYS_ENDPOINT, {
    params: {
      startDate: formatDateForRequest(startDate),
      endDate: formatDateForRequest(endDate)
    }
  });
};
