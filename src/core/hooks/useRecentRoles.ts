// 1. Get the role from the selected activity
// 2. If date is valid then get the last role imputed before the date from activities array
// 3. If date is valid then get the last recent role from the recent roles array
import {useCalendarResources} from "core/contexts/CalendarResourcesContext"
import DateTime from "services/DateTime"
import {IRecentRole} from "api/interfaces/IRecentRole"
import {IActivityDay} from "api/interfaces/IActivity"
import {last} from "utils/helpers"

const useRecentRoles = (date: Date, activityRoleId?: number) => {
  const {activitiesReader} = useCalendarResources()
  const {activities, recentRoles } = activitiesReader()
  const isDateValid = DateTime.isAfter(
    date,
    DateTime.subMonths(DateTime.now(), 1)
  );

  function findRole() {
    if (recentRoles && recentRoles.length) {
      const roleId = activityRoleId || getLastImputedRole(activities, date) || getMostRecentRole(recentRoles)
      return recentRoles.find(r => r.id === roleId);
    }

    return undefined;
  }

  return isDateValid ? findRole() : undefined;
};

const getMostRecentRole = (recentRoles: IRecentRole[]) => {
  return recentRoles[0].id;
};

const getLastImputedRole = (activities: IActivityDay[], date: Date) => {
  const imputedDays = activities.filter(
    a =>
      a.activities.length > 0 &&
      (DateTime.isBefore(a.date, date) || DateTime.isSameDay(a.date, date))
  );
  const lastImputedDay = last(imputedDays);

  if (lastImputedDay) {
    const lastActivity = last(lastImputedDay.activities);
    return lastActivity?.projectRole.id;
  }

  return undefined;
};

export default useRecentRoles;