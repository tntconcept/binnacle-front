import { ActivityMother } from '../../../../../test-utils/mothers/activity-mother'
import { singleton } from 'tsyringe'
import { ActivityDaySummary } from '../domain/activity-day-summary'
import { ActivityRepository } from '../domain/activity-repository'
import { ActivityWithProjectRoleId } from '../domain/activity-with-project-role-id'
import { TimeSummary } from '../domain/time-summary'

@singleton()
export class FakeActivityRepository implements ActivityRepository {
  async getDaysForActivityNaturalDaysPeriod(): Promise<number> {
    return 1
  }

  async getDaysForActivityDaysPeriod(): Promise<number> {
    return 1
  }
  async getAll(): Promise<ActivityWithProjectRoleId[]> {
    return ActivityMother.activitiesWithProjectRoleId()
  }

  getActivityEvidence(): Promise<File> {
    throw new Error('Method not implemented.')
  }
  async getActivitySummary(): Promise<ActivityDaySummary[]> {
    return ActivityMother.marchActivitySummary()
  }
  create(): Promise<ActivityWithProjectRoleId> {
    throw new Error('Method not implemented.')
  }
  update(): Promise<ActivityWithProjectRoleId> {
    throw new Error('Method not implemented.')
  }
  delete(): Promise<void> {
    throw new Error('Method not implemented.')
  }
  async getTimeSummary(): Promise<TimeSummary> {
    return ActivityMother.timeSummary()
  }

  getPendingApproval(): Promise<ActivityWithProjectRoleId[]> {
    return Promise.resolve([])
  }

  approve(): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
