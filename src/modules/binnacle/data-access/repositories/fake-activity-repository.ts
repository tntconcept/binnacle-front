import { ActivitiesPerDay } from '../interfaces/activities-per-day.interface'
import { ActivityDaySummary } from '../interfaces/activity-day-summary'
import { ActivityRepository } from '../interfaces/activity-repository'
import { Activity } from '../interfaces/activity.interface'
import { RecentRole } from '../interfaces/recent-role'

export class FakeActivityRepository implements ActivityRepository {
  getActivitySummary(): Promise<ActivityDaySummary[]> {
    throw new Error('Method not implemented.')
  }
  getActivitiesBetweenDate(): Promise<ActivitiesPerDay[]> {
    throw new Error('Method not implemented.')
  }
  getActivityImage(): Promise<string> {
    throw new Error('Method not implemented.')
  }
  createActivity(): Promise<Activity> {
    throw new Error('Method not implemented.')
  }
  updateActivity(): Promise<Activity> {
    throw new Error('Method not implemented.')
  }
  deleteActivity(): Promise<void> {
    throw new Error('Method not implemented.')
  }
  getRecentProjectRoles(): Promise<RecentRole[]> {
    throw new Error('Method not implemented.')
  }
}
