import {IActivity, IActivityDay} from "interfaces/IActivity"
import {parseISO} from "date-fns"

export const rem = (pxValue: string) => {
  return (parseInt(pxValue.replace("px", "")) / 16)+"rem"
}

export type ClassName = string | false | void | null | 0;

export const cls = (...classNames: ClassName[]) => classNames.filter(Boolean).join(' ')

export const parseActivityDayDateString = (activityDay: IActivityDay): IActivityDay => {
  return {
    date: parseISO((activityDay.date as unknown) as string),
    workedMinutes: activityDay.workedMinutes,
    activities: activityDay.activities.map(parseActivityDateString)
  };
};

export const parseActivityDateString = (activity: IActivity): IActivity => {
  return {
    ...activity,
    startDate: parseISO((activity.startDate as unknown) as string)
  };
};