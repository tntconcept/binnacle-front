import { mock } from 'jest-mock-extended'
import { HttpClient } from '../../../../../shared/http/http-client'
import { DateInterval } from '../../../../../shared/types/date-interval'
import { chrono } from '../../../../../shared/utils/chrono'
import { SubcontractedActivityMother } from '../../../../../test-utils/mothers/subcontracted-activity-mother'
import { SubcontractedActivityWithProjectRoleIdMapper } from './subcontracted-activity-with-project-role-id-mapper'
import { HttpSubcontractedActivityRepository } from './http-subcontracted-activity-repository'
import { NewSubcontractedActivityDto } from './new-subcontracted-activity-dto'

describe('HttpSubcontractedActivityRepository', () => {
  it('should call http client for all activities', async () => {
    const { httpClient, httpSubcontractedActivityRepository } = setup()
    const interval: DateInterval = {
      start: new Date('2023-03-23T00:00:00.000Z'),
      end: new Date('2023-03-30T00:00:00.000Z')
    }
    const userId = 1
    const response = SubcontractedActivityMother.subcontractedActivitiesSerialized().map((x) =>
      SubcontractedActivityWithProjectRoleIdMapper.toDomain(x)
    )
    httpClient.get.mockResolvedValue(
      SubcontractedActivityMother.subcontractedActivitiesSerialized()
    )

    const result = await httpSubcontractedActivityRepository.getAll(interval, userId)
    result.forEach((element) => {
      element.duration *= 60
    })
    expect(httpClient.get).toHaveBeenCalledWith('/api/subcontracted-activity', {
      params: {
        startDate: chrono(interval.start).format(chrono.DATE_FORMAT),
        endDate: chrono(interval.end).format(chrono.DATE_FORMAT),
        userId
      }
    })
    expect(result).toEqual(response)
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
    console.log(response)
    const result = await httpSubcontractedActivityRepository.create(newSubcontractedActivity)
    console.log(result)
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
