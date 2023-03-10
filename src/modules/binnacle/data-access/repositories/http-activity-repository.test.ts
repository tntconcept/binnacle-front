import { HttpClient } from 'shared/data-access/http-client/http-client'
import { mock } from 'jest-mock-extended'
import {
  HttpActivityRepository,
  Serialized
} from 'modules/binnacle/data-access/repositories/http-activity-repository'
import { ActivitiesPerDay } from 'modules/binnacle/data-access/interfaces/activities-per-day.interface'
import { buildOrganization, buildProject, mockProjectRole } from 'test-utils/generateTestMocks'
import { Activity } from 'modules/binnacle/data-access/interfaces/activity.interface'
import endpoints from 'shared/api/endpoints'

describe('HttpActivityRepository', () => {
  it('should get activities between date', async () => {
    const { httpActivityRepository, httpClient } = setup()

    const activitiesPerDayResponse: Serialized<ActivitiesPerDay[]> = [
      {
        date: '2021-10-01',
        workedMinutes: 0,
        activities: [
          {
            billable: false,
            description: '',
            duration: 0,
            hasImage: false,
            id: 1,
            imageFile: undefined,
            organization: buildOrganization({ id: 10 }),
            project: buildProject({ id: 20 }),
            projectRole: mockProjectRole({ id: 30 }),
            startDate: '2020-09-02T10:00:00Z',
            userId: 2
          }
        ]
      }
    ]
    httpClient.get.mockResolvedValue(activitiesPerDayResponse)

    const startDate = new Date('2020-09-01')
    const endDate = new Date('2020-10-01')

    const result = await httpActivityRepository.getActivitiesBetweenDate(startDate, endDate)

    expect(httpClient.get).toHaveBeenCalledWith(endpoints.activity, {
      params: { endDate: '2020-10-01', startDate: '2020-09-01' }
    })
    expect(result).toMatchInlineSnapshot(`
      Array [
        Object {
          "activities": Array [
            Object {
              "billable": false,
              "description": "",
              "duration": 0,
              "hasImage": false,
              "id": 1,
              "imageFile": undefined,
              "organization": Object {
                "id": 10,
                "name": "Test Organization Name",
              },
              "project": Object {
                "billable": false,
                "id": 20,
                "name": "Test Project Name",
                "open": true,
              },
              "projectRole": Object {
                "id": 30,
                "name": "Test Project Role Name",
                "requireEvidence": false,
              },
              "startDate": 2020-09-02T10:00:00.000Z,
              "userId": 2,
            },
          ],
          "date": 2021-09-30T22:00:00.000Z,
          "workedMinutes": 0,
        },
      ]
    `)
  })

  it('should get activity image', async () => {
    const { httpActivityRepository, httpClient } = setup()

    httpClient.get.mockResolvedValue('base64 image')

    const result = await httpActivityRepository.getActivityImage(1)

    expect(result).toEqual('base64 image')
    expect(httpClient.get).toHaveBeenCalledWith(`${endpoints.activity}/${1}/image`)
  })

  it('should create activity', async () => {
    const { httpActivityRepository, httpClient } = setup()

    const activityResponse: Serialized<Activity> = {
      billable: false,
      description: '',
      duration: 0,
      hasImage: false,
      id: 1,
      imageFile: undefined,
      organization: buildOrganization({ id: 10 }),
      project: buildProject({ id: 20 }),
      projectRole: mockProjectRole({ id: 30 }),
      startDate: '2020-10-10T10:00:00Z',
      userId: 2
    }
    httpClient.post.mockResolvedValue(activityResponse)

    const value = {
      id: undefined,
      startDate: new Date('2020-10-10'),
      duration: 10,
      billable: false,
      description: 'Lorem ipsum',
      projectRoleId: 10,
      hasImage: true,
      imageFile: 'base64 image'
    }
    const result = await httpActivityRepository.createActivity(value)

    expect(httpClient.post).toHaveBeenCalledWith(endpoints.activity, {
      billable: false,
      description: 'Lorem ipsum',
      duration: 10,
      hasImage: true,
      id: undefined,
      imageFile: 'base64 image',
      projectRoleId: 10,
      startDate: '2020-10-10T02:00:00.000Z'
    })
    expect(result).toMatchInlineSnapshot(`
      Object {
        "billable": false,
        "description": "",
        "duration": 0,
        "hasImage": false,
        "id": 1,
        "imageFile": undefined,
        "organization": Object {
          "id": 10,
          "name": "Test Organization Name",
        },
        "project": Object {
          "billable": false,
          "id": 20,
          "name": "Test Project Name",
          "open": true,
        },
        "projectRole": Object {
          "id": 30,
          "name": "Test Project Role Name",
          "requireEvidence": false,
        },
        "startDate": 2020-10-10T10:00:00.000Z,
        "userId": 2,
      }
    `)
  })

  it('should update activity', async () => {
    const { httpActivityRepository, httpClient } = setup()

    const activityResponse: Serialized<Activity> = {
      billable: false,
      description: '',
      duration: 0,
      hasImage: false,
      id: 1,
      imageFile: undefined,
      organization: buildOrganization({ id: 10 }),
      project: buildProject({ id: 20 }),
      projectRole: mockProjectRole({ id: 30 }),
      startDate: '2020-10-10T10:00:00Z',
      userId: 2
    }
    httpClient.put.mockResolvedValue(activityResponse)

    const value = {
      id: 5,
      startDate: new Date('2020-10-10'),
      duration: 10,
      billable: false,
      description: 'Lorem ipsum',
      projectRoleId: 10,
      hasImage: true,
      imageFile: 'base64 image'
    }
    const result = await httpActivityRepository.updateActivity(value)

    expect(httpClient.put).toHaveBeenCalledWith(endpoints.activity, {
      billable: false,
      description: 'Lorem ipsum',
      duration: 10,
      hasImage: true,
      id: 5,
      imageFile: 'base64 image',
      projectRoleId: 10,
      startDate: '2020-10-10T02:00:00.000Z'
    })
    expect(result).toMatchInlineSnapshot(`
      Object {
        "billable": false,
        "description": "",
        "duration": 0,
        "hasImage": false,
        "id": 1,
        "imageFile": undefined,
        "organization": Object {
          "id": 10,
          "name": "Test Organization Name",
        },
        "project": Object {
          "billable": false,
          "id": 20,
          "name": "Test Project Name",
          "open": true,
        },
        "projectRole": Object {
          "id": 30,
          "name": "Test Project Role Name",
          "requireEvidence": false,
        },
        "startDate": 2020-10-10T10:00:00.000Z,
        "userId": 2,
      }
    `)
  })

  it('should delete activity', async () => {
    const { httpActivityRepository, httpClient } = setup()

    await httpActivityRepository.deleteActivity(1)

    expect(httpClient.delete).toHaveBeenCalledWith(`${endpoints.activity}/${1}`)
  })

  it('should get recent project roles', async () => {
    const { httpActivityRepository, httpClient } = setup()

    const recentProjectRoles: any[] = []
    httpClient.get.mockResolvedValue(recentProjectRoles)

    const result = await httpActivityRepository.getRecentProjectRoles()

    expect(result).toBe(recentProjectRoles)
    expect(httpClient.get).toHaveBeenCalledWith(endpoints.recentProjectRoles)
  })
})

function setup() {
  const httpClient = mock<HttpClient>()

  return {
    httpClient,
    httpActivityRepository: new HttpActivityRepository(httpClient)
  }
}
