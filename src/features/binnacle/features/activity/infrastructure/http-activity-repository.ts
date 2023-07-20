import { Base64Converter } from '../../../../../shared/base64/base64-converter'
import { HttpClient } from '../../../../../shared/http/http-client'
import { DateInterval } from '../../../../../shared/types/date-interval'
import { Id } from '../../../../../shared/types/id'
import { Serialized } from '../../../../../shared/types/serialized'
import { chrono, parseISO } from '../../../../../shared/utils/chrono'
import { singleton } from 'tsyringe'
import { ActivityDaySummary } from '../domain/activity-day-summary'
import { ActivityRepository } from '../domain/activity-repository'
import { ActivityWithProjectRoleId } from '../domain/activity-with-project-role-id'
import { NewActivity } from '../domain/new-activity'
import { TimeSummary } from '../domain/time-summary'
import { UpdateActivity } from '../domain/update-activity'
import { ActivityWithProjectRoleIdDto } from './activity-with-project-role-id-dto'
import { ActivityWithProjectRoleIdMapper } from './activity-with-project-role-id-mapper'
import { NewActivityDto } from './new-activity-dto'
import { UpdateActivityDto } from './update-activity-dto'
import { ActivityApprovalStateFilter } from '../domain/activity-approval-state-filter'

@singleton()
export class HttpActivityRepository implements ActivityRepository {
  protected static activityPath = '/api/activity'
  protected static activitySummaryPath = `${HttpActivityRepository.activityPath}/summary`
  protected static activityByIdPath = (id: Id) => `${HttpActivityRepository.activityPath}/${id}`
  protected static activityApprovePath = (id: Id) =>
    `${HttpActivityRepository.activityPath}/${id}/approve`
  protected static activityEvidencePath = (id: Id) =>
    `${HttpActivityRepository.activityByIdPath(id)}/evidence`
  protected static timeSummaryPath = '/api/time-summary'
  protected static activityDaysPath = '/api/calendar/workable-days/count'
  protected static activityNaturalDaysPath = '/api/calendar/days/count'

  constructor(private httpClient: HttpClient, private base64Converter: Base64Converter) {}

  async getAll({ start, end }: DateInterval, userId: Id): Promise<ActivityWithProjectRoleId[]> {
    const data = await this.httpClient.get<ActivityWithProjectRoleIdDto[]>(
      HttpActivityRepository.activityPath,
      {
        params: {
          startDate: chrono(start).format(chrono.DATE_FORMAT),
          endDate: chrono(end).format(chrono.DATE_FORMAT),
          userId
        }
      }
    )

    return data.map((x) => ActivityWithProjectRoleIdMapper.toDomain(x))
  }

  async getActivityEvidence(activityId: Id): Promise<File> {
    const response = await this.httpClient.get<string>(
      HttpActivityRepository.activityEvidencePath(activityId)
    )

    return this.base64Converter.toFile(response, '')
  }

  async getActivitySummary({ start, end }: DateInterval): Promise<ActivityDaySummary[]> {
    const data = await this.httpClient.get<Serialized<ActivityDaySummary[]>>(
      HttpActivityRepository.activitySummaryPath,
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

  async create(newActivity: NewActivity): Promise<ActivityWithProjectRoleId> {
    const { evidence } = newActivity
    const serializedActivity: NewActivityDto = {
      ...newActivity,
      interval: {
        start: chrono(newActivity.interval.start).getLocaleDateString(),
        end: chrono(newActivity.interval.end).getLocaleDateString()
      },
      evidence: undefined
    }

    if (evidence) {
      const evidenceConverted = await this.base64Converter.toBase64(evidence)
      serializedActivity.evidence = `data:${evidence.type};base64,${evidenceConverted}`
    }

    return this.httpClient.post<ActivityWithProjectRoleId>(
      HttpActivityRepository.activityPath,
      serializedActivity
    )
  }

  async update(activity: UpdateActivity): Promise<ActivityWithProjectRoleId> {
    const { evidence } = activity
    const serializedActivity: UpdateActivityDto = {
      ...activity,
      interval: {
        start: chrono(activity.interval.start).getLocaleDateString(),
        end: chrono(activity.interval.end).getLocaleDateString()
      },
      evidence: undefined
    }

    if (evidence) {
      const evidenceConverted = await this.base64Converter.toBase64(evidence)
      serializedActivity.evidence = `data:${evidence.type};base64,${evidenceConverted}`
    }

    return this.httpClient.put<ActivityWithProjectRoleId>(
      HttpActivityRepository.activityPath,
      serializedActivity
    )
  }

  delete(activityId: Id): Promise<void> {
    return this.httpClient.delete(HttpActivityRepository.activityByIdPath(activityId))
  }

  getTimeSummary(date: Date): Promise<TimeSummary> {
    return this.httpClient.get(HttpActivityRepository.timeSummaryPath, {
      params: {
        date: chrono(date).format(chrono.DATE_FORMAT)
      }
    })
  }

  async getActivityBasedOnApprovalState(
    approvalState: ActivityApprovalStateFilter
  ): Promise<ActivityWithProjectRoleId[]> {
    const data = await this.httpClient.get<ActivityWithProjectRoleIdDto[]>(
      HttpActivityRepository.activityPath,
      {
        params: {
          approvalState: approvalState
        }
      }
    )
    return data.map((x) => ActivityWithProjectRoleIdMapper.toDomain(x))
  }

  async approve(activityId: Id): Promise<void> {
    return this.httpClient.post(HttpActivityRepository.activityApprovePath(activityId))
  }

  getDaysForActivityDaysPeriod({ start, end }: DateInterval): Promise<number> {
    return this.httpClient.get<number>(HttpActivityRepository.activityDaysPath, {
      params: {
        startDate: chrono(start).format(chrono.DATE_FORMAT),
        endDate: chrono(end).format(chrono.DATE_FORMAT)
      }
    })
  }

  getDaysForActivityNaturalDaysPeriod(roleId: Id, { start, end }: DateInterval): Promise<number> {
    return this.httpClient.get<number>(HttpActivityRepository.activityNaturalDaysPath, {
      params: {
        startDate: chrono(start).format(chrono.DATE_FORMAT),
        endDate: chrono(end).format(chrono.DATE_FORMAT),
        roleId
      }
    })
  }
}
