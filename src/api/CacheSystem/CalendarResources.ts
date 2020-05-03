import {endOfMonth, isSameMonth, startOfMonth, startOfYear} from "date-fns"
import {getTimeBalanceBetweenDate} from "api/TimeBalanceAPI"
import {MemoryCacheStore} from "api/CacheSystem/MemoryCacheStore"
import {getLoggedUser} from "api/UserAPI"
import {buildTimeBalanceKey} from "services/BinnacleService"
import {getActivitiesBetweenDate} from "api/ActivitiesAPI"
import {firstDayOfFirstWeekOfMonth, lastDayOfLastWeekOfMonth} from "utils/DateUtils"
import {getHolidaysBetweenDate} from "api/HolidaysAPI"
import {getRecentRoles} from "api/RoleAPI"

export interface ISuspenseAPI<V> {
  read: () => V;
}

export function wrapPromise<V>(promise: Promise<V>): ISuspenseAPI<V> {
  let status = "pending";
  let result: V | Error;
  let suspender = promise.then(
    r => {
      status = "success";
      result = r as V;
    },
    e => {
      status = "error";
      result = e as Error;
    }
  );

  return {
    read() {
      if (status === "pending") {
        throw suspender;
      } else if (status === "error") {
        throw result;
      } else if (status === "success") {
        return result as V;
      } else {
        // never enters here is just to avoid typescript type error
        return result as V;
      }
    }
  };
}

export function CacheMethod(key: string) {
  return function(
    target: Object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    // Save a copy of the method being decorated
    const originalMethod = descriptor.value;
    descriptor.value = function(...args: Array<any>): Promise<any> {
      const completeKey =
        key +
        "_" +
        args
          .map(arg => (arg instanceof Date ? arg.toISOString() : arg))
          .join("_");
      console.log(completeKey, MemoryCacheStore.getSize());

      if (MemoryCacheStore.hasKey(completeKey)) {
        return MemoryCacheStore.getKey(completeKey);
      }

      return MemoryCacheStore.setKey(
        completeKey,
        new Promise<any>(async resolve => {
          resolve(originalMethod.apply(this, args));
        })
      );
    };

    return descriptor;
  };
}

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

    return totalTimeStats
  }

  // @CacheMethod("calendar_data")
  async fetchCalendarData(month: Date) {
    const firstDayOfFirstWeek = firstDayOfFirstWeekOfMonth(month);
    const lastDayOfLastWeek = lastDayOfLastWeekOfMonth(month);

    const canFetchRecentRoles =
      isSameMonth(new Date(), month) ||
      isSameMonth(new Date(), lastDayOfLastWeek);

    const [activities, holidays, recentRoles] = await Promise.all([
      getActivitiesBetweenDate(firstDayOfFirstWeek, lastDayOfLastWeek),
      getHolidaysBetweenDate(firstDayOfFirstWeek, lastDayOfLastWeek),
      canFetchRecentRoles ? getRecentRoles() : undefined
    ]);

    return {
      activities,
      holidays,
      recentRoles
    };
  }

  @CacheMethod("user")
  async fetchUser() {
    return await getLoggedUser();
  }
}

export const CalendarResources = new Resources();
