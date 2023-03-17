import chrono from 'shared/utils/chrono'
import {
  buildActivityDaySummaryForMarch,
  buildActivityWithProjectRoleId
} from 'test-utils/generateTestMocks'
import { ActivityDaySummary } from '../interfaces/activity-day-summary'
import { ActivityRepository } from '../interfaces/activity-repository'
import { ActivityWithProjectRoleId } from '../interfaces/activity-with-project-role-id.interface'
import { Activity } from '../interfaces/activity.interface'
import { RecentRole } from '../interfaces/recent-role'

export class FakeActivityRepository implements ActivityRepository {
  async getActivitySummary(): Promise<ActivityDaySummary[]> {
    return buildActivityDaySummaryForMarch()
  }

  async getActivities(): Promise<ActivityWithProjectRoleId[]> {
    return [
      buildActivityWithProjectRoleId({
        projectRoleId: 123,
        interval: {
          start: chrono(new Date('2023-03-03 07:30')).getDate(),
          end: chrono(new Date('2023-03-03 08:30')).getDate(),
          timeUnit: 'MINUTES',
          duration: 60
        }
      }),
      buildActivityWithProjectRoleId({
        projectRoleId: 123,
        interval: {
          start: chrono(new Date('2023-03-03 09:00')).getDate(),
          end: chrono(new Date('2023-03-03 13:00')).getDate(),
          timeUnit: 'MINUTES',
          duration: 60
        }
      }),
      buildActivityWithProjectRoleId({
        projectRoleId: 123,
        interval: {
          start: chrono(new Date('2023-03-03 14:00')).getDate(),
          end: chrono(new Date('2023-03-03 20:00')).getDate(),
          timeUnit: 'MINUTES',
          duration: 60
        }
      }),
      buildActivityWithProjectRoleId({
        projectRoleId: 123,
        interval: {
          start: chrono(new Date('2023-03-17 09:00:00')).getDate(),
          end: chrono(new Date('2023-03-17 10:15:00')).getDate(),
          timeUnit: 'MINUTES',
          duration: 75
        }
      }),
      buildActivityWithProjectRoleId({
        projectRoleId: 456,
        approvalState: 'PENDING'
      }),
      buildActivityWithProjectRoleId({
        projectRoleId: 123,
        interval: {
          start: chrono(new Date('2023-03-23 00:00:00')).getDate(),
          end: chrono(new Date('2023-03-30 00:00:00')).getDate(),
          timeUnit: 'DAY',
          duration: 6
        },
        approvalState: 'ACCEPTED',
        hasEvidence: true
      }),
      buildActivityWithProjectRoleId({
        projectRoleId: 123,
        interval: {
          start: chrono.now(),
          end: chrono(new Date()).plus(1, 'hour').getDate(),
          timeUnit: 'MINUTES',
          duration: 60
        }
      })
    ]
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
    return []
  }
}
