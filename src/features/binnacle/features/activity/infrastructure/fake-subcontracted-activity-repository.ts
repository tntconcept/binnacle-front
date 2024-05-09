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
    let subcontractedActivity = SubcontractedActivityMother.minutesBillableActivityA()

    if (newActivity.projectRoleId == 4) {
      subcontractedActivity = SubcontractedActivityMother.minutesBillableActivityB()
    }

    subcontractedActivity.id = this.activities.length + 1
    subcontractedActivity.description = newActivity.description
    subcontractedActivity.duration = newActivity.duration
    subcontractedActivity.month = newActivity.month

    const activity = {
      ...SubcontractedActivityMother.activityToActivityWithProjectRoleId(subcontractedActivity)
    }
    this.activities.push(activity)
    return activity
  }

  async update(
    activity: UpdateSubcontractedActivity
  ): Promise<SubcontractedActivityWithProjectRoleId> {
    const index = this.activities.findIndex((x) => x.id === activity.id)
    let updatedActivity = SubcontractedActivityMother.minutesBillableActivityA()

    if (activity.projectRoleId == 4) {
      updatedActivity = SubcontractedActivityMother.minutesBillableActivityB()
    }
    updatedActivity.duration = activity.duration
    updatedActivity.description = activity.description
    updatedActivity.month = activity.month
    const activityWithProjectRoleId = {
      ...SubcontractedActivityMother.activityToActivityWithProjectRoleId(updatedActivity)
    }
    this.activities.splice(index, 1, activityWithProjectRoleId)
    return activityWithProjectRoleId
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
