import type { Activity } from 'modules/binnacle/data-access/interfaces/activity.interface'
import endpoints from 'shared/api/endpoints'
import { HttpClient } from 'shared/data-access/http-client/http-client'
import { Serialized } from 'shared/types/Serialized'
import chrono, { parseISO } from 'shared/utils/chrono'
import { singleton } from 'tsyringe'
import { ActivityDaySummary } from '../interfaces/activity-day-summary'
import { ActivityRepository } from '../interfaces/activity-repository'
import { ActivityWithProjectRoleId } from '../interfaces/activity-with-project-role-id.interface'
import type { RecentRole } from '../interfaces/recent-role'
import { ActivityWithProjectRoleIdDto } from './dto/activity-with-project-role-id-dto'
import { ActivityWithProjectRoleIdMapper } from './dto/activity-with-project-role-id-mapper'

@singleton()
export class HttpActivityRepository implements ActivityRepository {
  constructor(private httpClient: HttpClient) {}

  async getActivities(startDate: Date, endDate: Date): Promise<ActivityWithProjectRoleId[]> {
    const data = await this.httpClient.get<ActivityWithProjectRoleIdDto[]>(endpoints.activity, {
      params: {
        startDate: chrono(startDate).format(chrono.DATE_FORMAT),
        endDate: chrono(endDate).format(chrono.DATE_FORMAT)
      }
    })

    return data.map((x) => ActivityWithProjectRoleIdMapper.toDomain(x))
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

  async getActivitySummary(startDate: Date, endDate: Date): Promise<ActivityDaySummary[]> {
    const data = await this.httpClient.get<Serialized<ActivityDaySummary[]>>(endpoints.activity, {
      params: {
        startDate: chrono(startDate).format(chrono.DATE_FORMAT),
        endDate: chrono(endDate).format(chrono.DATE_FORMAT)
      }
    })

    return data.map((x) => {
      return {
        date: parseISO(x.date),
        worked: x.worked
      }
    })
  }
}
