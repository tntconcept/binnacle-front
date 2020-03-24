import {IActivity, IActivityDay} from "interfaces/IActivity"
import {parseISO} from "date-fns"

const activityDayMapper = (activityDay: IActivityDay): IActivityDay => {
  return {
    date: parseISO((activityDay.date as unknown) as string),
    workedMinutes: activityDay.workedMinutes,
    activities: activityDay.activities.map(activityDateMapper)
  }
}

const activityDateMapper = (activity: IActivity): IActivity => {
  return {
    ...activity,
    startDate: parseISO((activity.startDate as unknown) as string + "Z")
  }
}

export {activityDayMapper, activityDateMapper}
