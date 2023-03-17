import { RecentRole } from 'modules/binnacle/data-access/interfaces/recent-role'
import { GetRecentRole } from 'modules/binnacle/components/ActivityForm/utils/get-recent-role'
import chrono from 'shared/utils/chrono'
import { Activity } from 'modules/binnacle/data-access/interfaces/activity.interface'
import { ActivityMother } from 'test-utils/mothers/activity-mother'

describe('GetRecentRole', () => {
  beforeEach(() => {
    chrono.now = jest.fn(() => new Date('2025-01-01'))
  })

  it('should return the first role of recent roles array when the activityId is undefined and activities is empty', async () => {
    const recentRoles: RecentRole[] = ActivityMother.recentRoles()
    const activities: Activity[] = []

    const past5Days = chrono().minus(5, 'day').getDate()

    const result = execute(past5Days, undefined, recentRoles, activities)

    expect(result).toStrictEqual(recentRoles.at(0))
  })

  it('should return undefined when activityId is undefined and activities and recent roles are empty', async () => {
    const pastDay = chrono().plus(1, 'day').getDate()

    const result = execute(pastDay, undefined, [], [])

    expect(result).toBe(undefined)
  })

  it('should return undefined when more than 30 days have past since the current date', async () => {
    const pastTwoMonths = chrono().minus(2, 'month').getDate()

    const result = execute(pastTwoMonths, undefined, [], [])

    expect(result).toBe(undefined)
  })

  it('should return the recent role of the activity', async () => {
    const activity = ActivityMother.minutesNoBillableActivityWithoutEvidence()
    const recentRoles = [ActivityMother.recentRoleInMinutes()]
    const activities = [activity]

    const result = execute(chrono.now(), activity.projectRole.id, recentRoles, activities)
    expect(result).toStrictEqual(recentRoles[0])
  })

  it('should select the first role when the activityId does not match with any recentRole', async () => {
    const recentRoles = [ActivityMother.recentRoleInMinutes()]
    const result = execute(chrono.now(), 12093, recentRoles, [])
    expect(result).toEqual(ActivityMother.recentRoleInMinutes())
  })

  it('should return the last imputed role', function () {
    const recentRoles = ActivityMother.recentRoles()
    const activities = ActivityMother.activities()

    const result = execute(chrono.now(), undefined, recentRoles, activities)
    expect(result).toEqual(ActivityMother.recentRoleInDays())
  })

  // it('should return the last recent role imputed before the current date', function () {
  //   chrono.now = jest.fn(() => new Date('2020-05-11'))
  //
  //   const firstDate = new Date('2020-05-10')
  //   const secondDate = new Date('2020-05-12')
  //
  //   const currentDate = new Date('2020-05-11')
  //
  //   const expectedRole = mockRecentRole({ id: 1 })
  //
  //   const recentRoles = [mockRecentRole(), expectedRole]
  //   const activities = [
  //     {
  //       date: firstDate,
  //       workedMinutes: 200,
  //       activities: [
  //         mockActivity({
  //           startDate: firstDate,
  //           duration: 200,
  //           projectRole: {
  //             id: expectedRole.id,
  //             name: expectedRole.name,
  //             requireEvidence: false
  //           }
  //         })
  //       ]
  //     },
  //     {
  //       date: secondDate,
  //       workedMinutes: 100,
  //       activities: [
  //         mockActivity({
  //           startDate: secondDate,
  //           duration: 100
  //         })
  //       ]
  //     }
  //   ]
  //
  //   const result = execute(currentDate, undefined, recentRoles, activities)
  //   expect(result).toEqual(expectedRole)
  // })
})

function execute(
  date: Date,
  selectedActivityRoleId: number | undefined,
  recentRoles: RecentRole[],
  activities: Activity[]
) {
  const { getRole } = new GetRecentRole(date, selectedActivityRoleId, recentRoles, activities)

  return getRole()
}
