import { ActivityDaySummary } from './activity-day-summary'
import { ActivityWithProjectRoleId } from './activity-with-project-role-id.interface'
import { Activity } from './activity.interface'
import { RecentRole } from './recent-role'

export interface ActivityRepository {
  getActivities(startDate: Date, endDate: Date): Promise<ActivityWithProjectRoleId[]>
  getActivityImage(activityId: number): Promise<string>
  getActivitySummary(startDate: Date, endDate: Date): Promise<ActivityDaySummary[]>
  createActivity(activity: any): Promise<Activity>
  updateActivity(activity: any): Promise<Activity>
  deleteActivity(activityId: number): Promise<void>
  getRecentProjectRoles(): Promise<RecentRole[]>
}
