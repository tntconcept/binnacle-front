import { Id } from 'shared/types/id'
import { ActivityDaySummary } from './activity-day-summary'
import { ActivityWithProjectRoleId } from './activity-with-project-role-id'
import { DateInterval } from 'shared/types/date-interval'
import { NewActivity } from './new-activity'
import { TimeSummary } from './time-summary'
import { UpdateActivity } from './update-activity'

export interface ActivityRepository {
  getAll(interval: DateInterval): Promise<ActivityWithProjectRoleId[]>
  getPending(): Promise<ActivityWithProjectRoleId[]>
  getActivityImage(activityId: Id): Promise<File>
  getActivitySummary(interval: DateInterval): Promise<ActivityDaySummary[]>
  create(newActivity: NewActivity): Promise<ActivityWithProjectRoleId>
  update(activity: UpdateActivity): Promise<ActivityWithProjectRoleId>
  delete(activityId: Id): Promise<void>
  getTimeSummary(date: Date): Promise<TimeSummary>
  setApproved(activityId: Id): Promise<void>
}
