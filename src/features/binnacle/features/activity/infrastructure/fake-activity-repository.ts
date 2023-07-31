import { ActivityMother } from '../../../../../test-utils/mothers/activity-mother'
import { singleton } from 'tsyringe'
import { ActivityDaySummary } from '../domain/activity-day-summary'
import { ActivityRepository } from '../domain/activity-repository'
import { ActivityWithProjectRoleId } from '../domain/activity-with-project-role-id'
import { TimeSummary } from '../domain/time-summary'
import { NewActivity } from '../domain/new-activity'
import { GetActivitiesQueryParams } from '../domain/get-activities-query-params'
import { Id } from '../../../../../shared/types/id'
import { UpdateActivity } from '../domain/update-activity'

@singleton()
export class FakeActivityRepository implements ActivityRepository {
  private activities: ActivityWithProjectRoleId[] = ActivityMother.activitiesWithProjectRoleId()

  async getDaysForActivityNaturalDaysPeriod(): Promise<number> {
    return 1
  }

  async getDaysForActivityDaysPeriod(): Promise<number> {
    return 1
  }

  async getAll(): Promise<ActivityWithProjectRoleId[]> {
    return this.activities
  }

  async getActivityEvidence(): Promise<File> {
    return new File([''], 'filename')
  }

  async getActivitySummary(): Promise<ActivityDaySummary[]> {
    return ActivityMother.marchActivitySummary()
  }

  async create(newActivity: NewActivity): Promise<ActivityWithProjectRoleId> {
    console.log('newActivity', newActivity)
    const activity = {
      ...ActivityMother.activityToActivityWithProjectRoleId(
        ActivityMother.minutesBillableActivityWithoutEvidence({
          id: this.activities.length + 1,
          description: newActivity.description,
          interval: {
            start: newActivity.interval.start,
            end: newActivity.interval.end,
            duration: 4 * 60,
            timeUnit: 'MINUTES'
          },
          approval: {
            canBeApproved: true,
            state: 'PENDING'
          }
        })
      )
    }

    this.activities.push(activity)
    return activity
  }

  async update(activity: UpdateActivity): Promise<ActivityWithProjectRoleId> {
    const index = this.activities.findIndex((x) => x.id === activity.id)
    const updatedActivity = ActivityMother.activityWithProjectRoleId({
      approval: {
        approvalDate: new Date(),
        approvedByUserId: 1,
        canBeApproved: false,
        state: 'ACCEPTED'
      }
    })
    this.activities.splice(index, 1, updatedActivity)
    return updatedActivity
  }

  async delete(activityId: Id): Promise<void> {
    this.activities = this.activities.filter((x) => x.id !== activityId)
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
