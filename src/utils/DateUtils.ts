import {
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  parse,
  startOfMonth,
  startOfWeek,
  subWeeks
} from 'date-fns'
import { es } from 'date-fns/locale'
import { IHolidays } from 'api/interfaces/IHolidays'

export const formatDateForQuery = (date: Date) => format(date, 'yyyy-MM-dd')

export const firstDayOfFirstWeekOfMonth = (month: Date) => {
  return startOfWeek(startOfMonth(month), { weekStartsOn: 1 })
}

export const lastDayOfLastWeekOfMonth = (month: Date) => {
  return endOfWeek(endOfMonth(month), { weekStartsOn: 1 })
}

export const getDatesIntervalByMonth = (selectedMonth: Date) => {
  return eachDayOfInterval({
    start: firstDayOfFirstWeekOfMonth(selectedMonth),
    end: lastDayOfLastWeekOfMonth(selectedMonth)
  })
}

export const getDaysOfWeek = (start: Date) => {
  return eachDayOfInterval({
    start: startOfWeek(start, { weekStartsOn: 1 }),
    end: endOfWeek(start, { weekStartsOn: 1 })
  })
}
export const getPreviousWeek = (week: Date) => {
  return subWeeks(week, 1)
}
export const getNextWeek = (week: Date) => {
  return addWeeks(week, 1)
}

export const formatDayAndMonth = (date: Date) => {
  const isSpanish = navigator.language === 'es-ES'
  const locale = isSpanish ? es : undefined
  const dateFormat = isSpanish ? "dd 'de' MMMM" : 'dd MMMM'
  return format(date, dateFormat, { locale })
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
  const isSpanish = navigator.language === 'es-ES'
  if (isSpanish) {
    return ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom']
  }
  return ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
}
export const isHoliday = (publicHolidays: IHolidays['holidays'], date: Date) =>
  publicHolidays.find((holiday) => isSameDay(holiday.date, date))

export const isVacation = (privateHolidays: IHolidays['vacations'], date: Date) =>
  privateHolidays.find((vacation) => vacation.days.some((day) => isSameDay(day, date)))
