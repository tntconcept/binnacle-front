import httpClient from 'core/services/HttpClient'
import { IHolidays } from 'core/api/interfaces'
import produce from 'immer'
import endpoints from 'core/api/endpoints'
import chrono, { parseISO } from 'core/services/Chrono'

export async function fetchHolidaysBetweenDate(startDate: Date, endDate: Date): Promise<IHolidays> {
  const response = await httpClient
    .get(endpoints.holidays, {
      searchParams: {
        startDate: chrono(startDate).format(chrono.DATE_FORMAT),
        endDate: chrono(endDate).format(chrono.DATE_FORMAT)
      }
    })
    .json<IHolidays>()

  return parseHolidayJSONDate(response)
}

export const parseHolidayJSONDate = (response: IHolidays) => {
  return produce(response, (draftState) => {
    draftState.holidays = draftState.holidays.map((holiday) => ({
      ...holiday,
      date: parseISO((holiday.date as unknown) as string)
    }))
    draftState.vacations = draftState.vacations.map((vacation) => ({
      ...vacation,
      days: vacation.days.map((date) => parseISO((date as unknown) as string)),
      chargeYear: parseISO((vacation.chargeYear as unknown) as string)
    }))
  })
}
