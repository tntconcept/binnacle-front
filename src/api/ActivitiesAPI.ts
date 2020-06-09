import httpClient from "services/HttpClient"
import endpoints from "api/endpoints"
import {formatDateForQuery} from "utils/DateUtils"
import {IActivity, IActivityDay, IActivityRequestDTO} from "api/interfaces/IActivity"
import {parseISO} from "date-fns"

export async function fetchActivitiesBetweenDate(startDate: Date, endDate: Date) {
  const response = await httpClient
    .get(endpoints.activities, {
      searchParams: {
        startDate: formatDateForQuery(startDate),
        endDate: formatDateForQuery(endDate)
      }
    })
    .json<IActivityDay[]>();

  return response.map(parseActivityDayDateJSON);
}

export async function createActivity(activity: Omit<IActivityRequestDTO, "id">) {
  const response = await httpClient
    .post(endpoints.activities, {
      json: { ...activity, startDate: activity.startDate.toISOString() }
    })
    .json<IActivity>();

  return parseActivityDateJSON(response);
}

export async function updateActivity(activity: IActivityRequestDTO): Promise<IActivity> {
  const response = await httpClient
    .put(endpoints.activities, {
      json: { ...activity }
    })
    .json<IActivity>();
  return parseActivityDateJSON(response);
}

export async function deleteActivityById(id: number) {
  return await httpClient.delete(`${endpoints.activities}/${id}`).text();
}

export async function fetchActivityImage(activityId: number) {
  return await httpClient.get(`${endpoints.activities}/${activityId}/image`).text();
}

const parseActivityDayDateJSON = (activityDay: IActivityDay): IActivityDay => {
  return {
    date: parseISO((activityDay.date as unknown) as string),
    workedMinutes: activityDay.workedMinutes,
    activities: activityDay.activities.map(parseActivityDateJSON)
  }
}

const parseActivityDateJSON = (activity: IActivity): IActivity => {
  return {
    ...activity,
    startDate: parseISO((activity.startDate as unknown) as string + "Z")
  }
}