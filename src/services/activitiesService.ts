import { axiosClient } from "services/axiosClient";
import { ACTIVITIES_ENDPOINT } from "services/endpoints";
import { formatDateForRequest } from "utils/calendarUtils";

export interface IActivity {
  id: number;
  startDate: string;
  duration: number;
  description: string;
  projectRole: {
    id: number;
    name: string;
  };
  userId: number;
  billable: boolean;
  organization: {
    id: number;
    name: string;
  };
  project: {
    id: number;
    name: string;
    open: boolean;
    billable: boolean;
  };
}

export interface IActivityResponse {
  date: string;
  workedMinutes: number;
  activities: IActivity[];
}

export const getActivitiesBetweenDate = async (
  startDate: Date,
  endDate: Date
) => {
  return await axiosClient.get<IActivityResponse[]>(ACTIVITIES_ENDPOINT, {
    params: {
      startDate: formatDateForRequest(startDate),
      endDate: formatDateForRequest(endDate)
    }
  });
};
