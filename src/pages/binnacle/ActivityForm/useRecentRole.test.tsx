import React from 'react'
import { renderHook } from '@testing-library/react-hooks'
import useRecentRole from 'pages/binnacle/ActivityForm/useRecentRole'
import { BinnacleResourcesContext } from 'core/providers/BinnacleResourcesProvider'
import { IRecentRole } from 'core/api/interfaces'
import { buildActivity, buildRecentRole } from 'test-utils/generateTestMocks'
import { IActivityDay } from 'core/api/interfaces'
import chrono from 'core/services/Chrono'

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
        date: chrono(chrono.now())
          .minus(5, 'day')
          .getDate(),
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
        date: chrono(chrono.now())
          .plus(1, 'day')
          .getDate(),
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
        date: chrono(chrono.now())
          .minus(2, 'month')
          .getDate(),
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
        date: chrono.now(),
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
        date: chrono.now(),
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
        date: chrono.now(),
        activityId: undefined
      },
      {
        activities: [
          {
            date: chrono(chrono.now())
              .minus(1, 'day')
              .getDate(),
            workedMinutes: 200,
            activities: [
              buildActivity({
                startDate: chrono(chrono.now())
                  .minus(1, 'day')
                  .getDate(),
                duration: 200
              })
            ]
          },
          {
            date: chrono.now(),
            workedMinutes: 100,
            activities: [
              buildActivity({
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
        ],
        recentRoles: [buildRecentRole(), recentRole]
      }
    )

    expect(result.current).toBe(recentRole)
  })

  it('should return the last recent role imputed before the current date', function() {
    chrono.now = jest.fn(() => new Date('2020-05-11'))

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
