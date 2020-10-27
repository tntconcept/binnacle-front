import chrono, { getHumanizedDuration, isSpanishLocale } from 'core/services/Chrono'
import { IHolidays } from 'core/api/interfaces'

export const roundToTwoDecimals = (num: number) => {
  return Math.round((num + Number.EPSILON) * 100) / 100
}

export const getDuration = (minutes: number, decimalFormat: boolean = false) => {
  if (decimalFormat) {
    return roundToTwoDecimals(Math.abs(minutes) / 60)
  }

  return Math.abs(minutes) > 0 ? getHumanizedDuration(minutes) : '0h'
}
export const getTimeInterval = (startTime: Date, amount: number) => {
  return (
    chrono(startTime).format(chrono.TIME_FORMAT) +
    ' - ' +
    chrono(startTime)
      .plus(amount, 'minute')
      .format(chrono.TIME_FORMAT)
  )
}

export const getWeekdaysName = () => {
  const isSpanish = isSpanishLocale()
  if (isSpanish) {
    return ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom']
  }
  return ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
}

export const isHoliday = (publicHolidays: IHolidays['holidays'], date: Date) =>
  publicHolidays.find((holiday) => chrono(holiday.date).isSame(date, 'day'))

export const isVacation = (privateHolidays: IHolidays['vacations'], date: Date) =>
  privateHolidays.find((vacation) => vacation.days.some((day) => chrono(day).isSame(date, 'day')))

export const firstDayOfFirstWeekOfMonth = (date: Date) => {
  return chrono(date)
    .startOf('month')
    .startOf('week')
    .getDate()
}

export const lastDayOfLastWeekOfMonth = (date: Date) => {
  return chrono(date)
    .endOf('month')
    .endOf('week')
    .getDate()
}
