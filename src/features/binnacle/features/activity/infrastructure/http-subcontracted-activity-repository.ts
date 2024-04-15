import { HttpClient } from '../../../../../shared/http/http-client'
import { DateInterval } from '../../../../../shared/types/date-interval'
import { Id } from '../../../../../shared/types/id'
import { Serialized } from '../../../../../shared/types/serialized'
import { chrono, parseISO } from '../../../../../shared/utils/chrono'
import { singleton } from 'tsyringe'
import { ActivityDaySummary } from '../domain/activity-day-summary'
import { SubcontractedActivityRepository } from '../domain/subcontracted-activity-repository'
import { SubcontractedActivityWithProjectRoleId } from '../domain/subcontracted-activity-with-project-role-id'
import { NewSubcontractedActivity } from '../domain/new-subcontracted-activity'
import { TimeSummary } from '../domain/time-summary'
import { UpdateSubcontractedActivity } from '../domain/update-subcontracted-activity'
import { SubcontractedActivityWithProjectRoleIdDto } from './subcontracted-activity-with-project-role-id-dto'
import { SubcontractedActivityWithProjectRoleIdMapper } from './subcontracted-activity-with-project-role-id-mapper'
import { NewSubcontractedActivityDto } from './new-subcontracted-activity-dto'
import { UpdateSubcontractedActivityDto } from './update-subcontracted-activity-dto'
import { GetSubcontractedActivitiesQueryParams } from '../domain/get-subcontracted-activities-query-params'

@singleton()
export class HttpSubcontractedActivityRepository implements SubcontractedActivityRepository {
  protected static activityPath = '/api/subcontracted_activity'
  protected static activitySummaryPath = `${HttpSubcontractedActivityRepository.activityPath}/summary`
  protected static activityByIdPath = (id: Id) =>
    `${HttpSubcontractedActivityRepository.activityPath}/${id}`
  protected static activityApprovePath = (id: Id) =>
    `${HttpSubcontractedActivityRepository.activityPath}/${id}/approve`
  protected static activityEvidencePath = (id: Id) =>
    `${HttpSubcontractedActivityRepository.activityByIdPath(id)}/evidence`
  protected static timeSummaryPath = '/api/time-summary'
  protected static activityDaysPath = '/api/calendar/workable-days/count'
  protected static activityNaturalDaysPath = '/api/calendar/days/count'

  constructor(private httpClient: HttpClient) {}

  async getAll(
    { start, end }: DateInterval,
    userId: number
  ): Promise<SubcontractedActivityWithProjectRoleId[]> {
    const data = await this.httpClient.get<SubcontractedActivityWithProjectRoleIdDto[]>(
      HttpSubcontractedActivityRepository.activityPath,
      {
        params: {
          startDate: chrono(start).format(chrono.DATE_FORMAT),
          endDate: chrono(end).format(chrono.DATE_FORMAT),
          userId
        }
      }
    )

    return data.map((x) => SubcontractedActivityWithProjectRoleIdMapper.toDomain(x))
  }
  /*
  async getActivityEvidence(activityId: Id): Promise<File> {
    const response = await this.httpClient.get<string>(
        HttpSubcontractedActivityRepository.activityEvidencePath(activityId)
    )

    return this.base64Converter.toFile(response, '')
  }
 */
  async getActivitySummary({ start, end }: DateInterval): Promise<ActivityDaySummary[]> {
    const data = await this.httpClient.get<Serialized<ActivityDaySummary[]>>(
      HttpSubcontractedActivityRepository.activitySummaryPath,
      {
        params: {
          startDate: chrono(start).format(chrono.DATE_FORMAT),
          endDate: chrono(end).format(chrono.DATE_FORMAT)
        }
      }
    )

    return data.map((x) => {
      return {
        date: parseISO(x.date),
        worked: x.worked
      }
    })
  }

  async create(
    newSubcontractedActivity: NewSubcontractedActivity
  ): Promise<SubcontractedActivityWithProjectRoleId> {
    const serializedSubcontractedActivity: NewSubcontractedActivityDto = {
      ...newSubcontractedActivity
      // interval: {
      //   start: chrono(newSubcontractedActivity.interval.start).getLocaleDateString(),
      //   end: chrono(newSubcontractedActivity.interval.end).getLocaleDateString()
      // }
    }

    return this.httpClient.post<SubcontractedActivityWithProjectRoleId>(
      HttpSubcontractedActivityRepository.activityPath,
      serializedSubcontractedActivity
    )
  }

  async update(
    updateSubcontractedActivity: UpdateSubcontractedActivity
  ): Promise<SubcontractedActivityWithProjectRoleId> {
    const serializedSubcontractedActivity: UpdateSubcontractedActivityDto = {
      ...updateSubcontractedActivity
      // interval: {
      //   start: chrono(activity.interval.start).getLocaleDateString(),
      //   end: chrono(activity.interval.end).getLocaleDateString()
      // },
      // evidence: undefined
    }

    return this.httpClient.put<SubcontractedActivityWithProjectRoleId>(
      HttpSubcontractedActivityRepository.activityPath,
      serializedSubcontractedActivity
    )
  }

  delete(activityId: Id): Promise<void> {
    return this.httpClient.delete(HttpSubcontractedActivityRepository.activityByIdPath(activityId))
  }

  getTimeSummary(date: Date): Promise<TimeSummary> {
    return this.httpClient.get(HttpSubcontractedActivityRepository.timeSummaryPath, {
      params: {
        date: chrono(date).format(chrono.DATE_FORMAT)
      }
    })
  }

  async getActivitiesBasedOnFilters(
    queryParams: GetSubcontractedActivitiesQueryParams
  ): Promise<SubcontractedActivityWithProjectRoleId[]> {
    const data = await this.httpClient.get<SubcontractedActivityWithProjectRoleIdDto[]>(
      HttpSubcontractedActivityRepository.activityPath,
      {
        params: {
          ...queryParams
        }
      }
    )
    return data.map((x) => SubcontractedActivityWithProjectRoleIdMapper.toDomain(x))
  }

  async approve(activityId: Id): Promise<void> {
    return this.httpClient.post(HttpSubcontractedActivityRepository.activityApprovePath(activityId))
  }

  getDaysForActivityDaysPeriod({ start, end }: DateInterval): Promise<number> {
    return this.httpClient.get<number>(HttpSubcontractedActivityRepository.activityDaysPath, {
      params: {
        startDate: chrono(start).format(chrono.DATE_FORMAT),
        endDate: chrono(end).format(chrono.DATE_FORMAT)
      }
    })
  }

  getDaysForActivityNaturalDaysPeriod(roleId: Id, { start, end }: DateInterval): Promise<number> {
    return this.httpClient.get<number>(
      HttpSubcontractedActivityRepository.activityNaturalDaysPath,
      {
        params: {
          startDate: chrono(start).format(chrono.DATE_FORMAT),
          endDate: chrono(end).format(chrono.DATE_FORMAT),
          roleId
        }
      }
    )
  }
}
