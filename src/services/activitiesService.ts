import { axiosClient } from "services/axiosClient";
import { ACTIVITIES_ENDPOINT } from "services/endpoints";
import { formatDateForRequest } from "utils/calendarUtils";
import { parseISO } from "date-fns";

export interface IActivity {
  id: number;
  startDate: Date;
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

export interface IActivityDay {
  date: Date;
  workedMinutes: number;
  activities: IActivity[];
}

export const getActivitiesBetweenDate = async (
  startDate: Date,
  endDate: Date
) => {
  return await axiosClient.get<IActivityDay[]>(ACTIVITIES_ENDPOINT, {
    params: {
      startDate: formatDateForRequest(startDate),
      endDate: formatDateForRequest(endDate)
    },
    transformResponse: (data: IActivityDay[]) =>
      data.map(activityResponse => ({
        date: parseISO((activityResponse.date as unknown) as string),
        workedMinutes: activityResponse.date,
        activities: activityResponse.activities.map(activity => ({
          ...activity,
          startDate: parseISO((activity.startDate as unknown) as string)
        }))
      }))
  });
};
