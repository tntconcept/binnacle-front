import {axiosClient} from "services/fetchClient"
import {ACTIVITIES_ENDPOINT} from "services/endpoints"
import {formatDateForRequest} from "utils/calendarUtils"
import axios from "axios"
import {parseISO} from "date-fns"
import {IActivityDay} from "interfaces/IActivity"

export const getActivitiesBetweenDate = async (
  startDate: Date,
  endDate: Date
) => {
  return await axiosClient.get<IActivityDay[]>(ACTIVITIES_ENDPOINT, {
    params: {
      startDate: formatDateForRequest(startDate),
      endDate: formatDateForRequest(endDate)
    },
    // @ts-ignore
    transformResponse: axios.defaults.transformResponse.concat(
      (data: IActivityDay[]) => {
        return data.map(activityResponse => ({
          date: parseISO((activityResponse.date as unknown) as string),
          workedMinutes: activityResponse.workedMinutes,
          activities: activityResponse.activities.map(activity => ({
            ...activity,
            startDate: parseISO((activity.startDate as unknown) as string)
          }))
        }));
      }
    )
  });
};
