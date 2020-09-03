import { IHolidays } from 'api/interfaces/IHolidays'
import parseISO from 'date-fns/parseISO'
import produce from 'immer'

export const transformHolidaysResponse = (response: IHolidays) => {
  return produce(response, (draftState) => {
    draftState.publicHolidays = draftState.publicHolidays.map((holiday) => ({
      ...holiday,
      date: parseISO((holiday.date as unknown) as string)
    }))
    draftState.privateHolidays = draftState.privateHolidays.map((holiday) => ({
      ...holiday,
      days: holiday.days.map((date) => parseISO((date as unknown) as string)),
      chargeYear: parseISO((holiday.chargeYear as unknown) as string)
    }))
  })
}
