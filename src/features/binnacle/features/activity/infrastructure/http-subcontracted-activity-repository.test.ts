import { mock } from 'jest-mock-extended'
import { HttpClient } from '../../../../../shared/http/http-client'
import { SubcontractedActivityMother } from '../../../../../test-utils/mothers/subcontracted-activity-mother'
import { SubcontractedActivityWithProjectRoleIdMapper } from './subcontracted-activity-with-project-role-id-mapper'
import { HttpSubcontractedActivityRepository } from './http-subcontracted-activity-repository'
import { NewSubcontractedActivityDto } from './new-subcontracted-activity-dto'
import { SubcontractedActivityWithProjectRoleId } from '../domain/subcontracted-activity-with-project-role-id'
import { GetSubcontractedActivitiesQueryParams } from '../domain/get-subcontracted-activities-query-params'

describe('HttpSubcontractedActivityRepository', () => {
  it('should call http client for all activities', async () => {
    const { httpClient, httpSubcontractedActivityRepository } = setup()
    const params: GetSubcontractedActivitiesQueryParams = {
      startDate: '2024-05-01',
      endDate: '2024-07-30',
      organizationId: 1
    }
    const response = SubcontractedActivityMother.subcontractedActivitiesSerialized().map((x) =>
      SubcontractedActivityWithProjectRoleIdMapper.toDomain(x)
    )
    httpClient.get.mockResolvedValue(
      SubcontractedActivityMother.subcontractedActivitiesSerialized()
    )

    const result = await httpSubcontractedActivityRepository.getAll(params)
    const resultInMinutes = result.map((element) => {
      const r: SubcontractedActivityWithProjectRoleId = {
        ...element,
        duration: element.duration * 60
      }
      return r
    })
    expect(httpClient.get).toHaveBeenCalledWith('/api/subcontracted-activity', {
      params
    })
    expect(resultInMinutes).toEqual(response)
  })

  it('should call http client to create an activity', async () => {
    const { httpClient, httpSubcontractedActivityRepository } = setup()
    const newSubcontractedActivity = SubcontractedActivityMother.newSubcontractedActivity()
    const response = SubcontractedActivityMother.minutesActivityWithProjectRoleIdA()
    const serializedSubcontractedActivity: NewSubcontractedActivityDto = {
      ...newSubcontractedActivity,
      duration: newSubcontractedActivity.duration * 60
    }
    httpClient.post.mockResolvedValue(response)
    const result = await httpSubcontractedActivityRepository.create(newSubcontractedActivity)
    expect(httpClient.post).toHaveBeenCalledWith(
      '/api/subcontracted-activity',
      serializedSubcontractedActivity
    )
    expect(result).toEqual(response)
  })

  it('should call http client to update an activity', async () => {
    const { httpClient, httpSubcontractedActivityRepository } = setup()
    const updateSubcontractedActivity = SubcontractedActivityMother.updateSubcontractedActivity()
    const response = SubcontractedActivityMother.minutesActivityWithProjectRoleIdA()
    const serializedSubcontractedActivity: NewSubcontractedActivityDto = {
      ...updateSubcontractedActivity,
      duration: updateSubcontractedActivity.duration * 60
    }
    httpClient.put.mockResolvedValue(response)

    const result = await httpSubcontractedActivityRepository.update(updateSubcontractedActivity)

    expect(httpClient.put).toHaveBeenCalledWith(
      '/api/subcontracted-activity',
      serializedSubcontractedActivity
    )
    expect(result).toEqual(response)
  })

  it('should call http client to delete an activity', async () => {
    const { httpClient, httpSubcontractedActivityRepository } = setup()
    const activityId = 1

    await httpSubcontractedActivityRepository.delete(activityId)

    expect(httpClient.delete).toHaveBeenCalledWith(`/api/subcontracted-activity/${activityId}`)
  })
})

function setup() {
  const httpClient = mock<HttpClient>()

  return {
    httpClient,
    httpSubcontractedActivityRepository: new HttpSubcontractedActivityRepository(httpClient)
  }
}
