import {endOfMonth, isSameMonth, startOfMonth, startOfYear} from "date-fns"
import {getTimeBalanceBetweenDate} from "api/TimeBalanceAPI"
import {getLoggedUser} from "api/UserAPI"
import {buildTimeBalanceKey} from "services/BinnacleService"
import {getActivitiesBetweenDate} from "api/ActivitiesAPI"
import {firstDayOfFirstWeekOfMonth, lastDayOfLastWeekOfMonth} from "utils/DateUtils"
import {getHolidaysBetweenDate} from "api/HolidaysAPI"
import {getRecentRoles} from "api/RoleAPI"
import {CacheMethod} from "api/CacheSystem/CacheDecorator"

class Resources {
  // @CacheMethod("time_data")
  async fetchTimeDataByMonth(month: Date) {
    const startDate = startOfMonth(month);
    const endDate = endOfMonth(month);

    const data = await getTimeBalanceBetweenDate(startDate, endDate);

    return data[buildTimeBalanceKey(month)];
  }

  async fetchTimeDataByYear(month: Date) {
    const response = await getTimeBalanceBetweenDate(
      startOfYear(month),
      endOfMonth(month)
    );

    const onlySelectedYear = Object.fromEntries(
      Object.entries(response).filter(([key]) =>
        key.includes(month.getFullYear().toString())
      )
    );

    const totalTimeStats = Object.values(onlySelectedYear).reduce(
      (prevValue, currentValue) => ({
        timeWorked: prevValue.timeWorked + currentValue.timeWorked,
        timeToWork: prevValue.timeToWork + currentValue.timeToWork,
        timeDifference: prevValue.timeDifference + currentValue.timeDifference
      })
    );

    return totalTimeStats;
  }

  async fetchHolidays(month: Date) {
    const firstDayOfFirstWeek = firstDayOfFirstWeekOfMonth(month);
    const lastDayOfLastWeek = lastDayOfLastWeekOfMonth(month);

    return await getHolidaysBetweenDate(firstDayOfFirstWeek, lastDayOfLastWeek);
  }

  // @CacheMethod("calendar_data")
  async fetchActivities(month: Date) {
    const firstDayOfFirstWeek = firstDayOfFirstWeekOfMonth(month);
    const lastDayOfLastWeek = lastDayOfLastWeekOfMonth(month);

    const canFetchRecentRoles =
      isSameMonth(new Date(), month) ||
      isSameMonth(new Date(), lastDayOfLastWeek);

    const [activities, recentRoles] = await Promise.all([
      getActivitiesBetweenDate(firstDayOfFirstWeek, lastDayOfLastWeek),
      canFetchRecentRoles ? getRecentRoles() : undefined
    ]);

    return {
      activities,
      recentRoles
    };
  }

  @CacheMethod("user")
  async fetchUser() {
    return await getLoggedUser();
  }
}

export const CalendarResources = new Resources();
