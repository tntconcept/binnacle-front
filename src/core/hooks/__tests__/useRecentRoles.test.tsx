import React from "react"
import {renderHook} from "@testing-library/react-hooks"
import {addDays, subDays} from "date-fns"
import useRecentRoles from "../useRecentRoles"
import {CalendarResourcesContext} from "core/contexts/CalendarResourcesContext"
import DateTime from "../../../../src/services/DateTime"
import {IRecentRole} from "api/interfaces/IRecentRole"
import {buildActivity, buildRecentRole} from "utils/generateTestMocks"

describe("useRecentRoles hook", () => {
  const recentRole: IRecentRole =  buildRecentRole({id: 1})
  const activitiesResources = {
    read() {
      return {
        activities: [],
        recentRoles: [recentRole]
      }
    }
  }
  const wrapper: React.FC = ({ children }) => (
    <CalendarResourcesContext.Provider
      // @ts-ignore
      value={{
        // @ts-ignore
        activitiesResources: activitiesResources
      }}>{children}</CalendarResourcesContext.Provider>
  )

  it('should return the last recent role when the activities array is empty and activityRoleId does not exist', function () {
    const validDate = subDays(new Date(), 5)
    const activityToEditRoleId = undefined
    const { result } = renderHook(() => useRecentRoles(validDate, activityToEditRoleId), {wrapper})
    expect(result.current).toBe(recentRole)
  })

  it('should return undefined when activities array is empty and recent roles too', function () {
    const date = addDays(new Date(), 1)
    const activityRoleId = undefined
    const activitiesResources = {
      read() {
        return {
          activities: [],
          recentRoles: []
        }
      }
    }

    const wrapper: React.FC = ({ children }) => (
      <CalendarResourcesContext.Provider
        // @ts-ignore
        value={{
          // @ts-ignore
          activitiesResources: activitiesResources
        }}>{children}</CalendarResourcesContext.Provider>
    )

    const { result } = renderHook(() => useRecentRoles(date, activityRoleId), {wrapper})

    expect(result.current).toBe(undefined)
  })

  it('should return undefined when the date is more than 30 days ago', function () {
    const date = DateTime.subMonths(DateTime.now(), 2)
    const activityRoleId = undefined
    const { result } = renderHook(() => useRecentRoles(date, activityRoleId), {wrapper})

    expect(result.current).toBe(undefined)
  })

  it('should return recent role of the activity', function () {
    const date = DateTime.now()
    const activityRoleId = 1
    const { result } = renderHook(() => useRecentRoles(date, activityRoleId), {wrapper})

    expect(result.current).toBe(recentRole)
  })

  it('should return undefined if role is not found', function () {
    const date = DateTime.now()
    const activityRoleId = 100
    const { result } = renderHook(() => useRecentRoles(date, activityRoleId), {wrapper})

    expect(result.current).toBe(undefined)
  })

  it('should return last imputed role', function () {
    const date = DateTime.now()
    const activityRoleId = undefined
    const activity = buildActivity({projectRole: {id: 1, name: "Test"}})
    const activitiesResources = {
      read() {
        return {
          activities: [{
            date: activity.startDate,
            duration: activity.duration,
            activities: [activity]
          }],
          recentRoles: [recentRole]
        }
      }
    }
    const wrapper: React.FC = ({ children }) => (
      <CalendarResourcesContext.Provider
        // @ts-ignore
        value={{
          // @ts-ignore
          activitiesResources: activitiesResources
        }}>{children}</CalendarResourcesContext.Provider>
    )

    const { result } = renderHook(() => useRecentRoles(date, activityRoleId), {wrapper})

    expect(result.current).toBe(recentRole)
  })
})