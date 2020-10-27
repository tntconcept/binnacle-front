import produce from 'immer'
import chrono from 'core/services/Chrono'

export const transformVacationResponse = (response: any) => {
  return produce(response, (draftState: any) => {
    draftState.holidays = draftState.holidays.map((holiday: any) => ({
      ...holiday,
      date: chrono(holiday.date)
        .startOf('day')
        .getDate()
    }))
    draftState.vacations = draftState.vacations.map((holiday: any) => ({
      ...holiday,
      days: holiday.days.map((date: any) =>
        chrono(date)
          .startOf('day')
          .getDate()
      ),
      chargeYear: chrono(holiday.chargeYear)
        .startOf('day')
        .getDate()
    }))
  })
}
