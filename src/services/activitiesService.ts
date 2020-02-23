import {fetchClient} from "services/FetchClient"
import {ACTIVITIES_ENDPOINT} from "services/endpoints"
import {formatDateForQuery} from "utils/DateUtils"
import {IActivity, IActivityDay, IActivityRequestDTO} from "interfaces/IActivity"
import {parseActivityDateString, parseActivityDayDateString} from "utils/helpers"

export const getActivitiesBetweenDate = async (
  startDate: Date,
  endDate: Date
) => {
  const result = await fetchClient
    .get(ACTIVITIES_ENDPOINT, {
      searchParams: {
        startDate: formatDateForQuery(startDate),
        endDate: formatDateForQuery(endDate)
      }
    })
    .json<IActivityDay[]>();

  return result.map(parseActivityDayDateString);
};

export const createActivity = async (
  activity: Omit<IActivityRequestDTO, "id">
) => {
  const result = await fetchClient
    .post(ACTIVITIES_ENDPOINT, {
      json: { ...activity }
    })
    .json<IActivity>();

  return parseActivityDateString(result)
};

export const updateActivity = async (activity: IActivityRequestDTO) => {
  const result = await fetchClient.put(ACTIVITIES_ENDPOINT, {
    json: {...activity}
  }).json<IActivity>()
  return parseActivityDateString(result)
};

export const deleteActivity = async (id: number) => {
  return await fetchClient.delete(`${ACTIVITIES_ENDPOINT}/${id}`).text()
};
