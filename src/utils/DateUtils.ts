import { IHolidays } from 'api/interfaces/IHolidays'
import chrono, { parse, isSpanishLocale } from 'services/Chrono'

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

export const getDatesIntervalByMonth = (selectedMonth: Date) => {
  return chrono(firstDayOfFirstWeekOfMonth(selectedMonth)).eachDayUntil(
    lastDayOfLastWeekOfMonth(selectedMonth)
  )
}

export const getDaysOfWeek = (date: Date) => {
  return chrono(date)
    .startOf('week')
    .eachDayUntil(
      chrono(date)
        .endOf('week')
        .getDate()
    )
}
export const getPreviousWeek = (week: Date) => {
  return chrono(week)
    .minus(1, 'week')
    .getDate()
}
export const getNextWeek = (week: Date) => {
  return chrono(week)
    .plus(1, 'week')
    .getDate()
}

export const formatDayAndMonth = (date: Date) => {
  const isSpanish = isSpanishLocale()
  const dateFormat = isSpanish ? "dd 'de' MMMM" : 'dd MMMM'
  return chrono(date).format(dateFormat)
}

const getUTCDate = (dateString = Date.now()) => {
  const date = new Date(dateString)

  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  )
}

export const timeToDate = (time: string, backupDate?: Date) => {
  return parse(time, 'HH:mm', backupDate || getUTCDate())
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
