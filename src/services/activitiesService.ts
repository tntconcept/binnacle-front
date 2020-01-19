import {fetchClient} from "services/fetchClient"
import {ACTIVITIES_ENDPOINT} from "services/endpoints"
import {formatDateForRequest} from "utils/calendarUtils"
import {IActivityDay} from "interfaces/IActivity"
import {parseISO} from "date-fns"

export const getActivitiesBetweenDate = async (
  startDate: Date,
  endDate: Date
) => {
  return await fetchClient
    .url(ACTIVITIES_ENDPOINT)
    .query({
      startDate: formatDateForRequest(startDate),
      endDate: formatDateForRequest(endDate)
    })
    .get()
    .json((activityDay) => {
      return (activityDay as IActivityDay[]).map(it => ({
        date: parseISO((it.date as unknown) as string),
        workedMinutes: it.workedMinutes,
        activities: it.activities.map(activity => ({
          ...activity,
          startDate: parseISO((activity.startDate as unknown) as string)
        }))
      }))
    })
}