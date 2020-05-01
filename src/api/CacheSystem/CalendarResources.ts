import {endOfMonth, isSameMonth, startOfMonth} from "date-fns"
import {getTimeBalanceBetweenDate} from "api/TimeBalanceAPI"
import {MemoryCacheStore} from "api/CacheSystem/MemoryCacheStore"
import {getLoggedUser} from "api/UserAPI"
import {buildTimeBalanceKey} from "services/BinnacleService"
import {getActivitiesBetweenDate} from "api/ActivitiesAPI"
import {firstDayOfFirstWeekOfMonth, lastDayOfLastWeekOfMonth} from "utils/DateUtils"
import {getHolidaysBetweenDate} from "api/HolidaysAPI"
import {getRecentRoles} from "api/RoleAPI"


export function wrapPromise(promise: any): {read: () => any, preload: () => any} {
  let status = "pending";
  let result: any;
  let suspender = promise.then(
    // @ts-ignore
    r => {
      status = "success";
      result = r;
    },
    // @ts-ignore
    e => {
      status = "error";
      result = e;
    }
  );
  return {
    read() {
      if (status === "pending") {
        throw suspender;
      } else if (status === "error") {
        throw result;
      } else if (status === "success") {
        return result;
      }
    },
    preload() {
      if (status === "error") {
        throw result;
      } else if (status === "success") {
        return result;
      }
    }
  };
}

export interface MemoizeOption {
  key: string,
  // Time in seconds for how long the result will be cached
  ttl: number
}

export function CacheMethod(key: string) {
  return function (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    // Save a copy of the method being decorated
    const originalMethod = descriptor.value;
    descriptor.value = function(...args: Array<any>): Promise<any> {
      const completeKey = key +"_"+args.map(arg => arg instanceof Date ? arg.toISOString() : arg).join("_")
      console.log(completeKey, MemoryCacheStore.getSize())

      if (MemoryCacheStore.hasKey(completeKey)) {
        return MemoryCacheStore.getKey(completeKey);
      }

      return MemoryCacheStore.setKey(completeKey, new Promise<any>(async resolve => {
        resolve(originalMethod.apply(this, args));
      }));
    };

    return descriptor;
  }
}

class Resources {
  @CacheMethod("time_data")
  async fetchTimeData(month: Date) {
    const startDate = startOfMonth(month);
    const endDate = endOfMonth(month);

    const data = await getTimeBalanceBetweenDate(startDate, endDate)

    return data[buildTimeBalanceKey(month)]
  }

  @CacheMethod("calendar_data")
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
    ])

    return {
      activities,
      holidays,
      recentRoles
    }
  }

  @CacheMethod("user")
  async fetchUser() {
    return await getLoggedUser()
  }
}

export const CalendarResources = new Resources()