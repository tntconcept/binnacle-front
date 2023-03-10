import type { ActivitiesPerDay } from 'modules/binnacle/data-access/interfaces/activities-per-day.interface'
import type { Activity } from 'modules/binnacle/data-access/interfaces/activity.interface'
import endpoints from 'shared/api/endpoints'
import { HttpClient } from 'shared/data-access/http-client/http-client'
import chrono, { parseISO } from 'shared/utils/chrono'
import { singleton } from 'tsyringe'
import { ActivityRepository } from '../interfaces/activity-repository'
import type { RecentRole } from '../interfaces/recent-role'

export type Serialized<T> = {
  [P in keyof T]: T[P] extends Date ? string : Serialized<T[P]>
}

@singleton()
export class HttpActivityRepository implements ActivityRepository {
  constructor(private httpClient: HttpClient) {}

  async getActivitiesBetweenDate(startDate: Date, endDate: Date): Promise<ActivitiesPerDay[]> {
    const data = await this.httpClient.get<Serialized<ActivitiesPerDay[]>>(endpoints.activity, {
      params: {
        startDate: chrono(startDate).format(chrono.DATE_FORMAT),
        endDate: chrono(endDate).format(chrono.DATE_FORMAT)
      }
    })

    return data.map((x) => ({
      date: parseISO(x.date),
      workedMinutes: x.workedMinutes,
      activities: x.activities.map(this.activityResponseToActivity)
    }))
  }

  async getActivityImage(activityId: number): Promise<string> {
    return await this.httpClient.get(`${endpoints.activity}/${activityId}/image`)
  }

  async createActivity(activity: any): Promise<Activity> {
    const data = await this.httpClient.post<Serialized<Activity>>(endpoints.activity, {
      ...activity,
      startDate: chrono(activity.startDate).toISOString()
    })

    return this.activityResponseToActivity(data)
  }

  async updateActivity(activity: any): Promise<Activity> {
    const data = await this.httpClient.put<Serialized<Activity>>(endpoints.activity, {
      ...activity,
      startDate: chrono(activity.startDate).toISOString()
    })

    return this.activityResponseToActivity(data)
  }

  async deleteActivity(activityId: number): Promise<void> {
    return await this.httpClient.delete(`${endpoints.activity}/${activityId}`)
  }

  async getRecentProjectRoles(): Promise<RecentRole[]> {
    return await this.httpClient.get(endpoints.recentProjectRoles)
  }

  private activityResponseToActivity = (activity: Serialized<Activity>): Activity => {
    return {
      ...activity,
      startDate: parseISO(activity.startDate)
    }
  }
}
