import { HttpClient } from 'shared/data-access/http-client/http-client'
import { mock } from 'jest-mock-extended'
import { HttpActivityRepository } from 'modules/binnacle/data-access/repositories/http-activity-repository'
import endpoints from 'shared/api/endpoints'
import { ActivityMother } from 'test-utils/mothers/activity-mother'

describe('HttpActivityRepository', () => {
  it('should get activities between date', async () => {
    const { httpActivityRepository, httpClient } = setup()

    const activities = [ActivityMother.minutesBillableActivityWithProjectRoleId()]
    const activitiesDto = [ActivityMother.serializedMinutesBillableActivityWithProjectRoleIdDto()]
    httpClient.get.mockResolvedValue(activitiesDto)

    const startDate = '2020-09-01'
    const endDate = '2020-10-01'

    const result = await httpActivityRepository.getActivities(
      new Date(startDate),
      new Date(endDate)
    )

    expect(httpClient.get).toHaveBeenCalledWith(endpoints.activity, {
      params: { endDate, startDate }
    })
    expect(result).toEqual(activities)
  })

  it('should get activity image', async () => {
    const { httpActivityRepository, httpClient } = setup()

    httpClient.get.mockResolvedValue('base64 image')

    const result = await httpActivityRepository.getActivityImage(1)

    expect(result).toEqual('base64 image')
    expect(httpClient.get).toHaveBeenCalledWith(`${endpoints.activity}/${1}/image`)
  })

  it('should create activity', async () => {})

  it('should update activity', async () => {})

  it('should delete activity', async () => {})

  it('should get recent project roles', async () => {})
})

function setup() {
  const httpClient = mock<HttpClient>()

  return {
    httpClient,
    httpActivityRepository: new HttpActivityRepository(httpClient)
  }
}
