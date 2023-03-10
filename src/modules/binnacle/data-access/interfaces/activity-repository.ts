import { ActivitiesPerDay } from './activities-per-day.interface'
import { Activity } from './activity.interface'
import { RecentRole } from './recent-role'

export interface ActivityRepository {
  getActivitiesBetweenDate(startDate: Date, endDate: Date): Promise<ActivitiesPerDay[]>
  getActivityImage(activityId: number): Promise<string>
  createActivity(activity: any): Promise<Activity>
  updateActivity(activity: any): Promise<Activity>
  deleteActivity(activityId: number): Promise<void>
  getRecentProjectRoles(): Promise<RecentRole[]>
}
