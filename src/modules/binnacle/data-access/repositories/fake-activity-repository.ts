import { ActivityMother } from 'test-utils/mothers/activity-mother'
import { ActivityDaySummary } from '../interfaces/activity-day-summary'
import { ActivityRepository } from '../interfaces/activity-repository'
import { ActivityWithProjectRoleId } from '../interfaces/activity-with-project-role-id.interface'
import { Activity } from '../interfaces/activity.interface'
import { RecentRole } from '../interfaces/recent-role'

export class FakeActivityRepository implements ActivityRepository {
  async getActivitySummary(): Promise<ActivityDaySummary[]> {
    return ActivityMother.marchActivitySummary()
  }

  async getActivities(): Promise<ActivityWithProjectRoleId[]> {
    return ActivityMother.activitiesWithProjectRoleId()
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

  async getRecentProjectRoles(): Promise<RecentRole[]> {
    return ActivityMother.recentRoles()
  }
}
