import {fetchClient} from "services/FetchClient"
import {ACTIVITIES_ENDPOINT} from "services/endpoints"
import {formatDateForQuery} from "utils/DateUtils"
import {IActivity, IActivityDay, IActivityRequestDTO} from "interfaces/IActivity"
import {parseActivityDateString, parseActivityDayDateString} from "utils/helpers"

export const getActivitiesBetweenDate = async (
  startDate: Date,
  endDate: Date
) => {
  return await fetchClient
    .url(ACTIVITIES_ENDPOINT)
    .query({
      startDate: formatDateForQuery(startDate),
      endDate: formatDateForQuery(endDate)
    })
    .get()
    .json(activityDay => (activityDay as IActivityDay[]).map(parseActivityDayDateString));
};

export const createActivity = async (activity: Omit<IActivityRequestDTO, "id">) => {
  return await fetchClient
    .url(ACTIVITIES_ENDPOINT)
    .post({ ...activity })
    .json(activity => parseActivityDateString(activity as IActivity));
};

export const updateActivity = async (activity: IActivityRequestDTO) => {
  return await fetchClient
    .url(ACTIVITIES_ENDPOINT)
    .put({ ...activity })
    .json(activity => parseActivityDateString(activity as IActivity));
};

export const deleteActivity = async (id: number) => {
  return await fetchClient
    .url(`${ACTIVITIES_ENDPOINT}/${id}`)
    .delete()
    .res()
};
