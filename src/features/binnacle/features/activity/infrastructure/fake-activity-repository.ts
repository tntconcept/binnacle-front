import { ActivityMother } from '../../../../../test-utils/mothers/activity-mother'
import { singleton } from 'tsyringe'
import { ActivityDaySummary } from '../domain/activity-day-summary'
import { ActivityRepository } from '../domain/activity-repository'
import { ActivityWithProjectRoleId } from '../domain/activity-with-project-role-id'
import { TimeSummary } from '../domain/time-summary'
import { NewActivity } from '../domain/new-activity'
import { GetActivitiesQueryParams } from '../domain/get-activities-query-params'
import { Id } from '../../../../../shared/types/id'

@singleton()
export class FakeActivityRepository implements ActivityRepository {
  private readonly activities: ActivityWithProjectRoleId[] =
    ActivityMother.activitiesWithProjectRoleId()

  async getDaysForActivityNaturalDaysPeriod(): Promise<number> {
    return 1
  }

  async getDaysForActivityDaysPeriod(): Promise<number> {
    return 1
  }

  async getAll(): Promise<ActivityWithProjectRoleId[]> {
    return this.activities
  }

  getActivityEvidence(): Promise<File> {
    throw new Error('Method not implemented.')
  }

  async getActivitySummary(): Promise<ActivityDaySummary[]> {
    return ActivityMother.marchActivitySummary()
  }

  async create(newActivity: NewActivity): Promise<ActivityWithProjectRoleId> {
    const activity = {
      ...ActivityMother.activityToActivityWithProjectRoleId(
        ActivityMother.minutesBillableActivityWithoutEvidence({
          id: this.activities.length + 1,
          description: newActivity.description,
          approval: {
            state: 'PENDING'
          }
        })
      )
    }

    this.activities.push(activity)
    return activity
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

  async getActivitiesBasedOnFilters(
    queryParams: GetActivitiesQueryParams
  ): Promise<ActivityWithProjectRoleId[]> {
    return this.activities.filter((x) => x.approval.state === queryParams.approvalState)
  }

  async approve(activityId: Id): Promise<void> {
    this.activities.find((x) => x.id === activityId)!.approval.state = 'ACCEPTED'
  }
}
