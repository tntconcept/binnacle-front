import dayjs from 'dayjs'
import produce from 'immer'

export const transformHolidaysResponse = (response: any) => {
  console.log('holidays', response.privateHolidays)

  return produce(response, (draftState: any) => {
    draftState.publicHolidays = draftState.publicHolidays.map((holiday: any) => ({
      ...holiday,
      date: dayjs(holiday.date).startOf('day')
    }))
    draftState.privateHolidays = draftState.privateHolidays.map((holiday: any) => ({
      ...holiday,
      days: holiday.days.map((date: any) => dayjs(date).startOf('day')),
      chargeYear: dayjs(holiday.chargeYear).startOf('day')
    }))
  })
}
