import {useCalendarResources} from "core/contexts/CalendarResourcesContext"
import {IActivityDay} from "api/interfaces/IActivity"
import DateTime from "services/DateTime"
import {last} from "utils/helpers"
import {IRecentRole} from "api/interfaces/IRecentRole"

// 1. Get role from current activity
// 2. Get last role imputed of current activities
// 3. If date is valid then get last recent role of recent roles array
const useRecentRoles = (date: Date, activityRoleId?: number) => {
  const { recentRoles, activities } = useCalendarResources().activitiesResources.read()
  const isDateValid = DateTime.isAfter(date, DateTime.subMonths(DateTime.now(), 1))
  const roleFound = () => {
    if (!isDateValid) {
      return undefined
    }

    const lastImputedRoleId = !activityRoleId ? getLastImputedRole(activities) || getLastRecentRole(recentRoles) : undefined

    // gets activity's role or last imputed role
    if (activityRoleId || lastImputedRoleId) {
      const roleId = activityRoleId || lastImputedRoleId
      return recentRoles ? recentRoles.find(r => r.id === roleId) : undefined
    }
    return undefined
  }
  return roleFound()
}

const getLastRecentRole = (recentRoles: IRecentRole[] | undefined) => {
  return last(recentRoles)?.id
}

const getLastImputedRole = (activities: IActivityDay[]) => {
  const imputedDays = activities.filter(a => a.activities.length > 0);
  const lastImputedDay = last(imputedDays);

  if (lastImputedDay) {
    const lastActivity = last(lastImputedDay.activities);
    return lastActivity?.projectRole.id
  }

  return undefined;
};

export default useRecentRoles
