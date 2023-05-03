import { Base64Converter } from 'shared/base64/base64-converter'
import { HttpClient } from 'shared/http/http-client'
import { DateInterval } from 'shared/types/date-interval'
import { Id } from 'shared/types/id'
import { Serialized } from 'shared/types/serialized'
import chrono, { parseISO } from 'shared/utils/chrono'
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

@singleton()
export class HttpActivityRepository implements ActivityRepository {
  protected static activityPath = '/activity'
  protected static activitySummaryPath = `${HttpActivityRepository.activityPath}/summary`
  protected static activityByIdPath = (id: Id) => `${HttpActivityRepository.activityPath}/${id}`
  protected static activityImagePath = (id: Id) =>
    `${HttpActivityRepository.activityByIdPath(id)}/image`
  protected static timeSummaryPath = '/time-summary'

  constructor(private httpClient: HttpClient, private base64Converter: Base64Converter) {}

  async getAll({ start, end }: DateInterval): Promise<ActivityWithProjectRoleId[]> {
    const data = await this.httpClient.get<ActivityWithProjectRoleIdDto[]>(
      HttpActivityRepository.activityPath,
      {
        params: {
          startDate: chrono(start).format(chrono.DATE_FORMAT),
          endDate: chrono(end).format(chrono.DATE_FORMAT)
        }
      }
    )

    return data.map((x) => ActivityWithProjectRoleIdMapper.toDomain(x))
  }

  async getActivityImage(activityId: Id): Promise<File> {
    const response = await this.httpClient.get<string>(
      HttpActivityRepository.activityImagePath(activityId)
    )
    const file = await this.base64Converter.toFile(`data:image/jpeg;base64,${response}`, '')
    return file
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
    const serializedActivity: NewActivityDto = {
      ...newActivity,
      interval: {
        start: chrono(newActivity.interval.start).getLocaleDateString(),
        end: chrono(newActivity.interval.end).getLocaleDateString()
      },
      imageFile: undefined
    }

    if (newActivity.imageFile) {
      serializedActivity.imageFile = await this.base64Converter.toBase64(newActivity.imageFile)
    }

    const data = await this.httpClient.post<ActivityWithProjectRoleId>(
      HttpActivityRepository.activityPath,
      serializedActivity
    )

    return data
  }

  async update(activity: UpdateActivity): Promise<ActivityWithProjectRoleId> {
    const serializedActivity: UpdateActivityDto = {
      ...activity,
      interval: {
        start: chrono(activity.interval.start).getLocaleDateString(),
        end: chrono(activity.interval.end).getLocaleDateString()
      },
      imageFile: undefined
    }

    if (activity.imageFile) {
      serializedActivity.imageFile = await this.base64Converter.toBase64(activity.imageFile)
    }

    const data = await this.httpClient.put<ActivityWithProjectRoleId>(
      HttpActivityRepository.activityPath,
      serializedActivity
    )

    return data
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
}
