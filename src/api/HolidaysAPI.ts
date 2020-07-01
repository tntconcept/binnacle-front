import httpClient from 'services/HttpClient'
import { formatDateForQuery } from 'utils/DateUtils'
import { IHolidays } from 'api/interfaces/IHolidays'
import { parseISO } from 'date-fns'
import produce from 'immer'
import endpoints from 'api/endpoints'

export async function fetchHolidaysBetweenDate(
  startDate: Date,
  endDate: Date
): Promise<IHolidays> {
  const response = await httpClient
    .get(endpoints.holidays, {
      searchParams: {
        startDate: formatDateForQuery(startDate),
        endDate: formatDateForQuery(endDate)
      }
    })
    .json<IHolidays>()

  return parseHolidayJSONDate(response)
}

export const parseHolidayJSONDate = (response: IHolidays) => {
  return produce(response, (draftState) => {
    draftState.publicHolidays = draftState.publicHolidays.map((holiday) => ({
      ...holiday,
      date: parseISO((holiday.date as unknown) as string)
    }))
    draftState.privateHolidays = draftState.privateHolidays.map((holiday) => ({
      ...holiday,
      days: holiday.days.map((date) => parseISO((date as unknown) as string))
    }))
  })
}
