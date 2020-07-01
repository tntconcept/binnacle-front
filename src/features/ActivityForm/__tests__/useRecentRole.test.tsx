import React from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { addDays, subDays } from 'date-fns'
import useRecentRole from 'features/ActivityForm/useRecentRole'
import { BinnacleResourcesContext } from 'features/BinnacleResourcesProvider'
import DateTime from 'services/DateTime'
import { IRecentRole } from 'api/interfaces/IRecentRole'
import { buildActivity, buildRecentRole } from 'utils/generateTestMocks'
import { IActivityDay } from 'api/interfaces/IActivity'

describe('useRecentRole hook', () => {
  type HookParams = { date: Date; activityId?: number }
  type ProviderMocks = {
    activities: IActivityDay[]
    recentRoles?: IRecentRole[]
  }

  function renderRecentRolesHook(
    { date, activityId }: HookParams,
    { activities, recentRoles }: ProviderMocks
  ) {
    const wrapper: React.FC = ({ children }) => (
      <BinnacleResourcesContext.Provider
        // @ts-ignore
        value={{
          // @ts-ignore
          activitiesReader: jest.fn(() => ({
            activities,
            recentRoles
          }))
        }}
      >
        {children}
      </BinnacleResourcesContext.Provider>
    )

    const utils = renderHook(() => useRecentRole(date, activityId), {
      wrapper
    })
    return utils
  }

  it('should return the first role of recent roles array when the activityId is undefined and activities is empty', function() {
    const firstRecentRole = buildRecentRole()
    const secondRecentRole = buildRecentRole()

    const { result } = renderRecentRolesHook(
      {
        date: subDays(DateTime.now(), 5),
        activityId: undefined
      },
      {
        activities: [],
        recentRoles: [firstRecentRole, secondRecentRole]
      }
    )

    expect(result.current).toBe(firstRecentRole)
  })

  it('should return undefined when activityId is undefined and activities and recent roles are empty', function() {
    const { result } = renderRecentRolesHook(
      {
        date: addDays(DateTime.now(), 1),
        activityId: undefined
      },
      {
        activities: [],
        recentRoles: []
      }
    )

    expect(result.current).toBe(undefined)
  })

  it('should return undefined when more than 30 days have past since the current date', function() {
    const { result } = renderRecentRolesHook(
      {
        date: DateTime.subMonths(DateTime.now(), 2),
        activityId: undefined
      },
      {
        activities: [],
        recentRoles: []
      }
    )

    expect(result.current).toBe(undefined)
  })

  it('should return the recent role of the activity', function() {
    const recentRole = buildRecentRole({ id: 100 })
    const activityRecentRole = buildRecentRole({ id: 1 })
    const { result } = renderRecentRolesHook(
      {
        date: DateTime.now(),
        activityId: activityRecentRole.id
      },
      {
        activities: [],
        recentRoles: [recentRole, activityRecentRole]
      }
    )

    expect(result.current).toBe(activityRecentRole)
  })

  it('should return undefined when the activityId does not match with any recentRole', function() {
    const recentRole = buildRecentRole({ id: 1 })
    const { result } = renderRecentRolesHook(
      {
        date: DateTime.now(),
        activityId: 100
      },
      {
        activities: [],
        recentRoles: [recentRole]
      }
    )

    expect(result.current).toBe(undefined)
  })

  it('should return the last imputed role', function() {
    const recentRole = buildRecentRole({ id: 1 })
    const { result } = renderRecentRolesHook(
      {
        date: DateTime.now(),
        activityId: undefined
      },
      {
        activities: [
          {
            date: DateTime.subDays(DateTime.now(), 1),
            workedMinutes: 200,
            activities: [
              buildActivity({
                startDate: DateTime.subDays(DateTime.now(), 1),
                duration: 200
              })
            ]
          },
          {
            date: DateTime.now(),
            workedMinutes: 100,
            activities: [
              buildActivity({
                projectRole: {
                  id: recentRole.id,
                  name: 'Test',
                  requireEvidence: false
                },
                startDate: DateTime.now(),
                duration: 100
              })
            ]
          }
        ],
        recentRoles: [buildRecentRole(), recentRole]
      }
    )

    expect(result.current).toBe(recentRole)
  })

  it('should return the last recent role imputed before the current date', function() {
    DateTime.now = jest.fn(() => new Date('2020-05-11'))

    const firstDate = new Date('2020-05-10')
    const secondDate = new Date('2020-05-12')

    const currentDate = new Date('2020-05-11')

    const expectedRole = buildRecentRole({ id: 1 })

    const { result } = renderRecentRolesHook(
      {
        date: currentDate,
        activityId: undefined
      },
      {
        activities: [
          {
            date: firstDate,
            workedMinutes: 200,
            activities: [
              buildActivity({
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
              buildActivity({
                startDate: secondDate,
                duration: 100
              })
            ]
          }
        ],
        recentRoles: [buildRecentRole(), expectedRole]
      }
    )

    expect(result.current).toBe(expectedRole)
  })
})
