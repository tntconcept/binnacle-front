import {isAfter, subMonths} from "date-fns"
import {useCalendarResources} from "pages/binnacle/desktop/CalendarResourcesContext"
import {IActivityDay} from "api/interfaces/IActivity"

const useRecentRoles = (date: Date, activityRoleId?: number) => {
  const { recentRoles, activities } = useCalendarResources().calendarResources.read()
  const isDateValid = isAfter(date, subMonths(new Date(), 1))

  const roleFound = () => {
    if (!isDateValid) {
      return undefined
    }

    const lastImputedRole = !activityRoleId ? getLastImputedRole(activities) : undefined

    // gets activity's role or last imputed role
    if (activityRoleId || lastImputedRole) {
      const roleId = activityRoleId || lastImputedRole!.id
      return recentRoles ? recentRoles.find(r => r.id === roleId) : undefined
    }
    return undefined
  }

  return roleFound()
}

const getLastImputedRole = (activities: IActivityDay[]) => {
  const imputedDays = activities.filter(a => a.activities.length > 0);
  const lastImputedDay = imputedDays[imputedDays.length - 1];

  if (lastImputedDay) {
    const lastActivity =
      lastImputedDay.activities[lastImputedDay.activities.length - 1];
    return {
      id: lastActivity.projectRole.id,
      name: lastActivity.projectRole.name,
      date: lastActivity.startDate,
      projectName: lastActivity.project.name,
      projectBillable: lastActivity.project.billable
    };
  }

  return undefined;
};

export default useRecentRoles
