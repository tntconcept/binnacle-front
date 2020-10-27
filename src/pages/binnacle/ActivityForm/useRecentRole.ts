// 1. Get the role from the selected activity
// 2. If date is valid then get the last role imputed before the date from activities array
// 3. If date is valid then get the last recent role from the recent roles array
import { useBinnacleResources } from 'core/providers/BinnacleResourcesProvider'
import { IRecentRole } from 'core/api/interfaces'
import { IActivityDay } from 'core/api/interfaces'
import { last } from 'core/utils/helpers'
import chrono from 'core/services/Chrono'

const useRecentRole = (date: Date, activityRoleId?: number) => {
  const { activitiesReader } = useBinnacleResources()
  const { activities, recentRoles } = activitiesReader()
  const isDateValid = chrono(date).isAfter(
    chrono(chrono.now)
      .minus(1, 'month')
      .getDate()
  )

  function findRole() {
    if (recentRoles && recentRoles.length) {
      const roleId =
        activityRoleId || getLastImputedRole(activities, date) || getMostRecentRole(recentRoles)
      return recentRoles.find((r) => r.id === roleId)
    }

    return undefined
  }

  return isDateValid ? findRole() : undefined
}

const getMostRecentRole = (recentRoles: IRecentRole[]) => {
  return recentRoles && recentRoles.length ? recentRoles[0].id : undefined
}

const getLastImputedRole = (activities: IActivityDay[], date: Date) => {
  const imputedDays = activities.filter(
    (a) =>
      a.activities.length > 0 &&
      (chrono(a.date).isBefore(date) || chrono(a.date).isSame(date, 'day'))
  )
  const lastImputedDay = last(imputedDays)

  if (lastImputedDay) {
    const lastActivity = last(lastImputedDay.activities)
    return lastActivity?.projectRole.id
  }

  return undefined
}

export default useRecentRole
