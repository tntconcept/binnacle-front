import httpClient from "services/HttpClient"
import endpoints from "api/endpoints"
import {formatDateForQuery} from "utils/DateUtils"
import {IActivity, IActivityDay, IActivityRequestDTO} from "api/interfaces/IActivity"
import {activityDateMapper, activityDayMapper} from "api/ActivitiesAPI/mapper"

class ActivitiesResource {
  async fetchAllBetweenDate(startDate: Date, endDate: Date) {
    const response = await httpClient
      .get(endpoints.activities, {
        searchParams: {
          startDate: formatDateForQuery(startDate),
          endDate: formatDateForQuery(endDate)
        }
      })
      .json<IActivityDay[]>();

    return response.map(activityDayMapper);
  }

  async create(activity: Omit<IActivityRequestDTO, "id">) {
    const response = await httpClient
      .post(endpoints.activities, {
        json: { ...activity, startDate: activity.startDate.toISOString() }
      })
      .json<IActivity>();

    return activityDateMapper(response);
  }

  async update(activity: IActivityRequestDTO): Promise<IActivity> {
    const response = await httpClient
      .put(endpoints.activities, {
        json: { ...activity }
      })
      .json<IActivity>();
    return activityDateMapper(response);
  }

  async delete(id: number) {
    return await httpClient.delete(`${endpoints.activities}/${id}`).text();
  }

  async fetchImage(id: number) {
    return await httpClient.get(`${endpoints.activities}/${id}/image`).text();
  }
}

const ActivitiesAPI = new ActivitiesResource()
export default ActivitiesAPI
