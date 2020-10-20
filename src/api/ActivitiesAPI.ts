import httpClient from 'services/HttpClient'
import endpoints from 'api/endpoints'
import { IActivity, IActivityDay, IActivityRequestBody } from 'api/interfaces/IActivity'
import chrono, { parseISO } from 'services/Chrono'
import i18n from 'app/i18n'

export async function fetchActivitiesBetweenDate(startDate: Date, endDate: Date) {
  const response = await httpClient
    .get(endpoints.activities, {
      searchParams: {
        startDate: chrono(startDate).format(chrono.DATE_FORMAT),
        endDate: chrono(endDate).format(chrono.DATE_FORMAT)
      }
    })
    .json<IActivityDay[]>()

  return response.map(parseActivityDayDateJSON)
}

export async function createActivity(activity: Omit<IActivityRequestBody, 'id'>) {
  const response = await httpClient
    .post(endpoints.activities, {
      json: { ...activity, startDate: chrono(activity.startDate).toISOString() }
    })
    .json<IActivity>()

  return parseActivityDateJSON(response)
}

export async function updateActivity(activity: IActivityRequestBody): Promise<IActivity> {
  const response = await httpClient
    .put(endpoints.activities, {
      json: { ...activity, startDate: chrono(activity.startDate).toISOString() }
    })
    .json<IActivity>()
  return parseActivityDateJSON(response)
}

export async function deleteActivityById(id: number) {
  return await httpClient.delete(`${endpoints.activities}/${id}`).text()
}

export async function fetchActivityImage(activityId: number) {
  return await httpClient.get(`${endpoints.activities}/${activityId}/image`).text()
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
    startDate: parseISO((activity.startDate as unknown) as string)
  }
}

export async function parseActivityErrorResponse(response: Response) {
  let message = undefined

  if (response.status === 400) {
    const body = await response.json()
    if (body.code === 'ACTIVITY_TIME_OVERLAPS') {
      message = {
        400: {
          title: i18n.t('activity_api_errors.time_overlaps_title'),
          description: i18n.t('activity_api_errors.time_overlaps_description')
        }
      }
    } else if (body.code === 'CLOSED_PROJECT') {
      message = {
        400: {
          title: i18n.t('activity_api_errors.closed_project_title'),
          description: i18n.t('activity_api_errors.closed_project_description')
        }
      }
    }
  }

  return message
}
