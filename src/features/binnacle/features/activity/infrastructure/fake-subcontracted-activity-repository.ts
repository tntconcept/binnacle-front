import { singleton } from 'tsyringe'
import { Id } from '../../../../../shared/types/id'
import { SubcontractedActivityRepository } from '../domain/subcontracted-activity-repository'
import { SubcontractedActivityWithProjectRoleId } from '../domain/subcontracted-activity-with-project-role-id'
import { NewSubcontractedActivity } from '../domain/new-subcontracted-activity'
import { SubcontractedActivityMother } from '../../../../../test-utils/mothers/subcontracted-activity-mother'
import { UpdateSubcontractedActivity } from '../domain/update-subcontracted-activity'
import { GetSubcontractedActivitiesQueryParams } from '../domain/get-subcontracted-activities-query-params'

@singleton()
export class FakeSubcontractedActivityRepository implements SubcontractedActivityRepository {
  private activities: SubcontractedActivityWithProjectRoleId[] =
    SubcontractedActivityMother.subcontractedActivitiesWithProjectRoleId()

  async getAll(): Promise<SubcontractedActivityWithProjectRoleId[]> {
    return this.activities
  }

  async create(
    newActivity: NewSubcontractedActivity
  ): Promise<SubcontractedActivityWithProjectRoleId> {
    const activity = {
      ...SubcontractedActivityMother.activityToActivityWithProjectRoleId(
        SubcontractedActivityMother.minutesBillableActivityWithoutEvidence({
          id: this.activities.length + 1,
          description: newActivity.description,
          duration: newActivity.duration,
          month: newActivity.month
        })
      )
    }

    this.activities.push(activity)
    return activity
  }

  async update(
    activity: UpdateSubcontractedActivity
  ): Promise<SubcontractedActivityWithProjectRoleId> {
    const index = this.activities.findIndex((x) => x.id === activity.id)
    const updatedActivity = SubcontractedActivityMother.activityWithProjectRoleId()
    this.activities.splice(index, 1, updatedActivity)
    return updatedActivity
  }

  async delete(activityId: Id): Promise<void> {
    this.activities = this.activities.filter((x) => x.id !== activityId)
  }

  async getActivitiesBasedOnFilters(
    queryParams: GetSubcontractedActivitiesQueryParams
  ): Promise<SubcontractedActivityWithProjectRoleId[]> {
    return this.activities.filter((x) => x.month === queryParams.startDate)
  }
}
