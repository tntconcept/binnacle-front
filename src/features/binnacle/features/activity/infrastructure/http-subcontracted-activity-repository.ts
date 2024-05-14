import { HttpClient } from '../../../../../shared/http/http-client'
import { DateInterval } from '../../../../../shared/types/date-interval'
import { Id } from '../../../../../shared/types/id'
import { chrono, getLastDayOfMonth } from '../../../../../shared/utils/chrono'
import { singleton } from 'tsyringe'
import { SubcontractedActivityRepository } from '../domain/subcontracted-activity-repository'
import { SubcontractedActivityWithProjectRoleId } from '../domain/subcontracted-activity-with-project-role-id'
import { NewSubcontractedActivity } from '../domain/new-subcontracted-activity'
import { UpdateSubcontractedActivity } from '../domain/update-subcontracted-activity'
import { SubcontractedActivityWithProjectRoleIdDto } from './subcontracted-activity-with-project-role-id-dto'
import { SubcontractedActivityWithProjectRoleIdMapper } from './subcontracted-activity-with-project-role-id-mapper'
import { NewSubcontractedActivityDto } from './new-subcontracted-activity-dto'
import { UpdateSubcontractedActivityDto } from './update-subcontracted-activity-dto'
import { GetSubcontractedActivitiesQueryParams } from '../domain/get-subcontracted-activities-query-params'

@singleton()
export class HttpSubcontractedActivityRepository implements SubcontractedActivityRepository {
  protected static activityPath = '/api/subcontracted-activity'
  protected static activityByIdPath = (id: Id) =>
    `${HttpSubcontractedActivityRepository.activityPath}/${id}`

  constructor(private readonly httpClient: HttpClient) {}

  async getAll(
    { start, end }: DateInterval,
    userId: number
  ): Promise<SubcontractedActivityWithProjectRoleId[]> {
    end = getLastDayOfMonth(end)
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
    const dataInHours = data.map((element) => {
      const r: SubcontractedActivityWithProjectRoleId = {
        ...element,
        duration: element.duration / 60
      }
      return r
    })
    return dataInHours.map((x) => SubcontractedActivityWithProjectRoleIdMapper.toDomain(x))
  }

  async create(
    newSubcontractedActivity: NewSubcontractedActivity
  ): Promise<SubcontractedActivityWithProjectRoleId> {
    const serializedSubcontractedActivity: NewSubcontractedActivityDto = {
      ...newSubcontractedActivity,
      duration: newSubcontractedActivity.duration * 60
    }

    const ac = await this.httpClient.post<SubcontractedActivityWithProjectRoleId>(
      HttpSubcontractedActivityRepository.activityPath,
      serializedSubcontractedActivity
    )
    ac.duration /= 60
    return ac
  }

  async update(
    updateSubcontractedActivity: UpdateSubcontractedActivity
  ): Promise<SubcontractedActivityWithProjectRoleId> {
    const serializedSubcontractedActivity: UpdateSubcontractedActivityDto = {
      ...updateSubcontractedActivity,
      duration: updateSubcontractedActivity.duration * 60
    }

    const up = await this.httpClient.put<SubcontractedActivityWithProjectRoleId>(
      HttpSubcontractedActivityRepository.activityPath,
      serializedSubcontractedActivity
    )
    up.duration /= 60
    return up
  }

  delete(activityId: Id): Promise<void> {
    return this.httpClient.delete(HttpSubcontractedActivityRepository.activityByIdPath(activityId))
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
    data.forEach((element) => {
      element.duration /= 60
    })
    return data.map((x) => SubcontractedActivityWithProjectRoleIdMapper.toDomain(x))
  }
}
