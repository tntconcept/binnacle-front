import { Id } from 'shared/types/id'
import { ActivityDaySummary } from './activity-day-summary'
import { Activity } from './activity.interface'
import { RecentRole } from './recent-role'

export interface ActivityRepository {
  getActivityImage(activityId: Id): Promise<string>
  getActivityImage(activityId: Id): Promise<string>
  getActivitySummary(startDate: Date, endDate: Date): Promise<ActivityDaySummary[]>
  createActivity(activity: any): Promise<Activity>
  deleteActivity(activityId: Id): Promise<void>
  deleteActivity(activityId: Id): Promise<void>
  getRecentProjectRoles(): Promise<RecentRole[]>
}
