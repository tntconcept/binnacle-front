import {index} from "services/HttpClient"
import {ACTIVITIES_ENDPOINT} from "services/endpoints"
import {formatDateForQuery} from "utils/DateUtils"
import {IActivity, IActivityDay, IActivityRequestDTO} from "interfaces/IActivity"
import {activityDateMapper, activityDayMapper} from "services/ActivitiesAPI/mapper"

export const getActivitiesBetweenDate = async (
  startDate: Date,
  endDate: Date
) => {
  const result = await index
    .get(ACTIVITIES_ENDPOINT, {
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
  const result = await index
    .post(ACTIVITIES_ENDPOINT, {
      json: { ...activity }
    })
    .json<IActivity>();

  return activityDateMapper(result)
};

export const updateActivity = async (activity: IActivityRequestDTO) => {
  const result = await index.put(ACTIVITIES_ENDPOINT, {
    json: {...activity}
  }).json<IActivity>()
  return activityDateMapper(result)
};

export const deleteActivity = async (id: number) => {
  return await index.delete(`${ACTIVITIES_ENDPOINT}/${id}`).text()
};

export const getActivityImage = async (id: number) => {
  return await index.get(`${ACTIVITIES_ENDPOINT}/${id}/image`).text()
}
