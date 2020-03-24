import httpClient from "api/HttpClient"
import {formatDateForQuery} from "utils/DateUtils"
import {IActivity, IActivityDay, IActivityRequestDTO} from "api/interfaces/IActivity"
import {activityDateMapper, activityDayMapper} from "api/ActivitiesAPI/mapper"
import endpoints from "api/endpoints"

export const getActivitiesBetweenDate = async (
  startDate: Date,
  endDate: Date
) => {
  const result = await httpClient
    .get(endpoints.activities, {
      searchParams: {
        startDate: formatDateForQuery(startDate),
        endDate: formatDateForQuery(endDate)
      }
    })
    .json<IActivityDay[]>();

  return result.map(activityDayMapper);
};

export const createActivity = async (
  activity: Omit<IActivityRequestDTO, "id">
) => {
  const result = await httpClient
    .post(endpoints.activities, {
      json: { ...activity }
    })
    .json<IActivity>();

  return activityDateMapper(result)
};

export const updateActivity = async (activity: IActivityRequestDTO) => {
  const result = await httpClient.put(endpoints.activities, {
    json: {...activity}
  }).json<IActivity>()
  return activityDateMapper(result)
};

export const deleteActivity = async (id: number) => {
  return await httpClient.delete(`${endpoints.activities}/${id}`).text()
};

export const getActivityImage = async (id: number) => {
  return await httpClient.get(`${endpoints.activities}/${id}/image`).text()
}
