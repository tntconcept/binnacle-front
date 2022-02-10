import { RecentRole } from 'modules/binnacle/data-access/interfaces/recent-role'
import { ActivitiesPerDay } from 'modules/binnacle/data-access/interfaces/activities-per-day.interface'
import { GetRecentRole } from 'modules/binnacle/components/ActivityForm/utils/get-recent-role'
import chrono from 'shared/utils/chrono'
import { mockActivity, mockProjectRole, mockRecentRole } from 'test-utils/generateTestMocks'

describe('GetRecentRole', () => {
  beforeEach(() => {
    chrono.now = jest.fn(() => new Date('2020-01-01'))
  })

  it('should return the first role of recent roles array when the activityId is undefined and activities is empty', async () => {
    const firstRecentRole = mockRecentRole({ id: 101 })
    const secondRecentRole = mockRecentRole({ id: 2 })
    const recentRoles: RecentRole[] = [firstRecentRole, secondRecentRole]
    const activities: ActivitiesPerDay[] = []

    const past5Days = chrono().minus(5, 'day').getDate()

    const result = setup(past5Days, undefined, recentRoles, activities)

    expect(result).toStrictEqual({
      date: '2020-01-01T00:00:00.000Z',
      id: 101,
      name: 'Test Recent Role Name',
      organizationName: 'Test Organization Name',
      projectBillable: false,
      projectName: 'Test Recent Role Project Name',
      requireEvidence: false
    })
  })

  it('should return undefined when activityId is undefined and activities and recent roles are empty', async () => {
    const pastDay = chrono().plus(1, 'day').getDate()

    const result = setup(pastDay, undefined, [], [])

    expect(result).toBe(undefined)
  })

  it('should return undefined when more than 30 days have past since the current date', async () => {
    const pastTwoMonths = chrono().minus(2, 'month').getDate()

    const result = setup(pastTwoMonths, undefined, [], [])

    expect(result).toBe(undefined)
  })

  it('should return the recent role of the activity', async () => {
    const projectRole = mockProjectRole({ id: 100 })
    const activity = mockActivity({ id: 1, projectRole: projectRole })
    const recentRoles = [
      {
        date: '2020-01-01T00:00:00Z',
        id: 100,
        name: 'Senior',
        organizationName: 'Viajes XL',
        projectBillable: true,
        projectName: 'Marketing',
        requireEvidence: true
      }
    ]
    const activities = [{ activities: [activity], date: activity.startDate, workedMinutes: 12903 }]

    const result = setup(chrono.now(), activity.projectRole.id, recentRoles, activities)
    expect(result).toStrictEqual({
      date: '2020-01-01T00:00:00Z',
      id: 100,
      name: 'Senior',
      organizationName: 'Viajes XL',
      projectBillable: true,
      projectName: 'Marketing',
      requireEvidence: true
    })
  })

  it('should return undefined when the activityId does not match with any recentRole', async () => {
    const recentRoles = [
      {
        date: '2020-01-01T00:00:00Z',
        id: 100,
        name: 'Senior',
        organizationName: 'Viajes XL',
        projectBillable: true,
        projectName: 'Marketing',
        requireEvidence: true
      }
    ]
    const result = setup(chrono.now(), 12093, recentRoles, [])
    expect(result).toBe(undefined)
  })

  it('should return the last imputed role', function () {
    const recentRole = mockRecentRole({ id: 1 })

    const recentRoles = [mockRecentRole(), recentRole]
    const activities = [
      {
        date: chrono(chrono.now()).minus(1, 'day').getDate(),
        workedMinutes: 200,
        activities: [
          mockActivity({
            startDate: chrono(chrono.now()).minus(1, 'day').getDate(),
            duration: 200
          })
        ]
      },
      {
        date: chrono.now(),
        workedMinutes: 100,
        activities: [
          mockActivity({
            projectRole: {
              id: recentRole.id,
              name: 'Test',
              requireEvidence: false
            },
            startDate: chrono.now(),
            duration: 100
          })
        ]
      }
    ]

    const result = setup(chrono.now(), undefined, recentRoles, activities)
    expect(result).toEqual(recentRole)
  })

  it('should return the last recent role imputed before the current date', function () {
    chrono.now = jest.fn(() => new Date('2020-05-11'))

    const firstDate = new Date('2020-05-10')
    const secondDate = new Date('2020-05-12')

    const currentDate = new Date('2020-05-11')

    const expectedRole = mockRecentRole({ id: 1 })

    const recentRoles = [mockRecentRole(), expectedRole]
    const activities = [
      {
        date: firstDate,
        workedMinutes: 200,
        activities: [
          mockActivity({
            startDate: firstDate,
            duration: 200,
            projectRole: {
              id: expectedRole.id,
              name: expectedRole.name,
              requireEvidence: false
            }
          })
        ]
      },
      {
        date: secondDate,
        workedMinutes: 100,
        activities: [
          mockActivity({
            startDate: secondDate,
            duration: 100
          })
        ]
      }
    ]

    const result = setup(currentDate, undefined, recentRoles, activities)
    expect(result).toEqual(expectedRole)
  })
})

function setup(
  date: Date,
  selectedActivityRoleId: number | undefined,
  recentRoles: RecentRole[],
  activities: ActivitiesPerDay[]
) {
  const { getRole } = new GetRecentRole(date, selectedActivityRoleId, recentRoles, activities)

  return getRole()
}
