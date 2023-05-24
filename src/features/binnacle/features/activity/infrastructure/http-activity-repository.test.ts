import { mock } from 'jest-mock-extended'
import { HttpClient } from 'shared/http/http-client'
import { HttpActivityRepository } from './http-activity-repository'
import { ActivityMother } from '../../../../../test-utils/mothers/activity-mother'
import { Base64Converter } from '../../../../../shared/base64/base64-converter'
import chrono, { parseISO } from '../../../../../shared/utils/chrono'
import { ActivityWithProjectRoleIdMapper } from './activity-with-project-role-id-mapper'
import { DateInterval } from '../../../../../shared/types/date-interval'
import { NewActivityDto } from './new-activity-dto'

describe('HttpActivityRepository', () => {
  it('should call http client for activities', async () => {
    const { httpClient, httpActivityRepository } = setup()
    const start = ActivityMother.marchActivitySummary().at(0)!.date
    const end = ActivityMother.marchActivitySummary().at(-1)!.date
    httpClient.get.mockResolvedValue(ActivityMother.serializedMarchActivitySummary())

    const result = await httpActivityRepository.getActivitySummary({ start, end })

    const parsedSummary = ActivityMother.marchActivitySummary().map((x) => {
      return {
        date: parseISO(chrono(x.date).format(chrono.DATE_FORMAT)),
        worked: x.worked
      }
    })

    expect(httpClient.get).toHaveBeenCalledWith('/api/activity/summary', {
      params: {
        endDate: chrono(end).format(chrono.DATE_FORMAT),
        startDate: chrono(start).format(chrono.DATE_FORMAT)
      }
    })
    expect(result).toEqual(parsedSummary)
  })

  it('should call http client for approve an activity', async () => {
    const { httpClient, httpActivityRepository } = setup()
    const id = 1

    await httpActivityRepository.setApproved(id)

    expect(httpClient.post).toHaveBeenCalledWith('/api/activity/1/approve')
  })

  it('should call http client for pending activities', async () => {
    const { httpClient, httpActivityRepository } = setup()
    const response = ActivityMother.activitiesPendingToApprove().map((x) =>
      ActivityWithProjectRoleIdMapper.toDomain(x)
    )
    httpClient.get.mockResolvedValue(ActivityMother.activitiesPendingToApprove())

    const result = await httpActivityRepository.getPending()

    expect(httpClient.get).toHaveBeenCalledWith('/api/activity', {
      params: {
        approvalState: 'pending'
      }
    })
    expect(result).toEqual(response)
  })

  it('should call http client for all activities', async () => {
    const { httpClient, httpActivityRepository } = setup()
    const interval: DateInterval = {
      start: new Date('2023-03-23T00:00:00.000Z'),
      end: new Date('2023-03-30T00:00:00.000Z')
    }
    const response = ActivityMother.activitiesPendingToApprove().map((x) =>
      ActivityWithProjectRoleIdMapper.toDomain(x)
    )
    httpClient.get.mockResolvedValue(ActivityMother.activitiesPendingToApprove())

    const result = await httpActivityRepository.getAll(interval)

    expect(httpClient.get).toHaveBeenCalledWith('/api/activity', {
      params: {
        startDate: chrono(interval.start).format(chrono.DATE_FORMAT),
        endDate: chrono(interval.end).format(chrono.DATE_FORMAT)
      }
    })
    expect(result).toEqual(response)
  })

  it('should call http client to get an activity image', async () => {
    const { httpClient, httpActivityRepository, base64Converter } = setup()
    const id = 1
    const anyHash = 'R0lGODlhAQABAAAAACw='
    httpClient.get.mockResolvedValue(anyHash)

    await httpActivityRepository.getActivityImage(id)

    expect(httpClient.get).toHaveBeenCalledWith('/api/activity/1/image')
    expect(base64Converter.toFile).toHaveBeenCalledWith(`data:image/jpeg;base64,${anyHash}`, '')
  })

  it('should call http client to create an activity', async () => {
    const { httpClient, httpActivityRepository, base64Converter } = setup()
    const anyHash = 'R0lGODlhAQABAAAAACw='
    const newActivity = ActivityMother.newActivity()
    const response = ActivityMother.daysActivityWithoutEvidencePendingWithProjectRoleId()
    const serializedActivity: NewActivityDto = {
      ...newActivity,
      interval: {
        start: chrono(newActivity.interval.start).getLocaleDateString(),
        end: chrono(newActivity.interval.end).getLocaleDateString()
      },
      imageFile: anyHash
    }
    base64Converter.toBase64.mockResolvedValue(anyHash)
    httpClient.post.mockResolvedValue(response)

    const result = await httpActivityRepository.create(newActivity)

    expect(base64Converter.toBase64).toHaveBeenCalledWith('file')
    expect(httpClient.post).toHaveBeenCalledWith('/api/activity', serializedActivity)
    expect(result).toEqual(response)
  })

  it('should call http client to update an activity', async () => {
    const { httpClient, httpActivityRepository, base64Converter } = setup()
    const anyHash = 'R0lGODlhAQABAAAAACw='
    const updateActivity = ActivityMother.updateActivity()
    const response = ActivityMother.daysActivityWithoutEvidencePendingWithProjectRoleId()
    const serializedActivity: NewActivityDto = {
      ...updateActivity,
      interval: {
        start: chrono(updateActivity.interval.start).getLocaleDateString(),
        end: chrono(updateActivity.interval.end).getLocaleDateString()
      },
      imageFile: anyHash
    }
    base64Converter.toBase64.mockResolvedValue(anyHash)
    httpClient.put.mockResolvedValue(response)

    const result = await httpActivityRepository.update(updateActivity)

    expect(base64Converter.toBase64).toHaveBeenCalledWith('file')
    expect(httpClient.put).toHaveBeenCalledWith('/api/activity', serializedActivity)
    expect(result).toEqual(response)
  })

  it('should call http client to delete an activity', async () => {
    const { httpClient, httpActivityRepository } = setup()
    const activityId = 1

    await httpActivityRepository.delete(activityId)

    expect(httpClient.delete).toHaveBeenCalledWith(`/api/activity/${activityId}`)
  })

  it('should call http client to get time summary', async () => {
    const { httpClient, httpActivityRepository } = setup()
    const date = new Date('2023-03-23T00:00:00.000Z')
    const timeSummary = ActivityMother.timeSummary()
    httpClient.get.mockResolvedValue(timeSummary)

    const result = await httpActivityRepository.getTimeSummary(date)

    expect(httpClient.get).toHaveBeenCalledWith('/api/time-summary', {
      params: {
        date: chrono(date).format(chrono.DATE_FORMAT)
      }
    })
    expect(result).toEqual(timeSummary)
  })
})

function setup() {
  const httpClient = mock<HttpClient>()
  const base64Converter = mock<Base64Converter>()

  return {
    httpClient,
    base64Converter,
    httpActivityRepository: new HttpActivityRepository(httpClient, base64Converter)
  }
}
