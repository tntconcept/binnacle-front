import dayjs from 'dayjs'
import produce from 'immer'

export const transformVacationResponse = (response: any) => {
  return produce(response, (draftState: any) => {
    draftState.holidays = draftState.holidays.map((holiday: any) => ({
      ...holiday,
      date: dayjs(holiday.date).startOf('day')
    }))
    draftState.vacations = draftState.vacations.map((holiday: any) => ({
      ...holiday,
      days: holiday.days.map((date: any) => dayjs(date).startOf('day')),
      chargeYear: dayjs(holiday.chargeYear).startOf('day')
    }))
  })
}
