import * as fns from 'date-fns'
import { isWithinInterval } from 'date-fns'
import { es } from 'date-fns/locale'
import { i18n } from '../i18n/i18n'
import { TimeUnit, TimeUnits } from '../types/time-unit'

export function isSpanishLocale() {
  return i18n.language === 'es-ES' || i18n.language === 'es'
}

function getLocale() {
  return isSpanishLocale() ? es : undefined // fallback of date-fns is en-US
}

type UnitType = 'day' | 'businessDay' | 'month' | 'year' | 'hour' | 'minute' | 'second'

const WEEK_STARTS_ON = 1

const parseDate = (date: Date | string) => {
  if (typeof date === 'string') {
    return parseISO(date)
  }

  return date
}

export function chrono(date?: Date | string) {
  const d = parseDate(date!) ?? chrono.now()
  return new Chrono(d)
}

chrono.TIME_FORMAT = 'HH:mm'
chrono.DATE_FORMAT = 'yyyy-MM-dd'
chrono.DATETIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss"
chrono.now = () => new Date()

class Chrono {
  constructor(private date: Date) {
    this.date = date
  }

  format = (formatStr: string) => {
    return fns.format(this.date, formatStr, {
      locale: getLocale(),
      weekStartsOn: WEEK_STARTS_ON
    })
  }

  formatRelative = () => {
    return relativeFormat(this.date)
  }

  plus = (value: number, unit: UnitType | 'week') => {
    switch (unit) {
      case 'day':
        this.date = fns.addDays(this.date, value)
        break
      case 'week':
        this.date = fns.addWeeks(this.date, value)
        break
      case 'month':
        this.date = fns.addMonths(this.date, value)
        break
      case 'year':
        this.date = fns.addYears(this.date, value)
        break
      case 'hour':
        this.date = fns.addHours(this.date, value)
        break
      case 'minute':
        this.date = fns.addMinutes(this.date, value)
        break
      case 'second':
        this.date = fns.addSeconds(this.date, value)
        break
    }

    return this
  }

  minus = (value: number, unit: UnitType | 'week') => {
    switch (unit) {
      case 'day':
        this.date = fns.subDays(this.date, value)
        break
      case 'week':
        this.date = fns.subWeeks(this.date, value)
        break
      case 'month':
        this.date = fns.subMonths(this.date, value)
        break
      case 'year':
        this.date = fns.subYears(this.date, value)
        break
      case 'hour':
        this.date = fns.subHours(this.date, value)
        break
      case 'minute':
        this.date = fns.subMinutes(this.date, value)
        break
      case 'second':
        this.date = fns.subSeconds(this.date, value)
        break
    }

    return this
  }

  isSame = (date: Date, unit?: UnitType) => {
    switch (unit) {
      case 'day':
        return fns.isSameDay(this.date, parseDate(date))
      case 'month':
        return fns.isSameMonth(this.date, parseDate(date))
      case 'year':
        return fns.isSameYear(this.date, parseDate(date))
      case 'hour':
        return fns.isSameHour(this.date, parseDate(date))
      case 'minute':
        return fns.isSameMinute(this.date, parseDate(date))
      case 'second':
        return fns.isSameSecond(this.date, parseDate(date))
      default: {
        return fns.isEqual(this.date, parseDate(date))
      }
    }
  }

  isBefore = (date: Date) => {
    return fns.isBefore(this.date, parseDate(date))
  }

  isAfter = (date: Date) => {
    return fns.isAfter(this.date, parseDate(date))
  }

  isToday = () => {
    return fns.isToday(this.date)
  }

  isThisWeek = () => {
    return fns.isThisWeek(this.date, { weekStartsOn: WEEK_STARTS_ON })
  }

  isThisMonth = () => {
    return fns.isThisMonth(this.date)
  }

  isThisYear = () => {
    return fns.isThisYear(this.date)
  }

  isSameDay = (date: Date) => {
    return this.isSame(date, 'year') && this.isSame(date, 'month') && this.isSame(date, 'day')
  }

  isBetween = (start: Date, end: Date) => {
    return (
      (this.isSameDay(start) || this.isAfter(start)) && (this.isBefore(end) || this.isSameDay(end))
    )
  }

  startOf = (unit: 'day' | 'week' | 'month' | 'year') => {
    switch (unit) {
      case 'day':
        this.date = fns.startOfDay(this.date)
        break
      case 'week':
        this.date = fns.startOfWeek(this.date, { weekStartsOn: WEEK_STARTS_ON })
        break
      case 'month':
        this.date = fns.startOfMonth(this.date)
        break
      case 'year':
        this.date = fns.startOfYear(this.date)
        break
    }
    return this
  }

  endOf = (unit: 'day' | 'week' | 'month' | 'year') => {
    switch (unit) {
      case 'day':
        this.date = fns.endOfDay(this.date)
        break
      case 'week':
        this.date = fns.endOfWeek(this.date, { weekStartsOn: WEEK_STARTS_ON })
        break
      case 'month':
        this.date = fns.endOfMonth(this.date)
        break
      case 'year':
        this.date = fns.endOfYear(this.date)
        break
    }
    return this
  }

  get = (unit: 'date' | 'minute' | 'weekday' | 'year'): number => {
    switch (unit) {
      case 'date':
        return fns.getDate(this.date)
      case 'weekday':
        return fns.getDay(this.date)
      case 'year':
        return fns.getYear(this.date)
      case 'minute':
        return fns.getMinutes(this.date)
    }
  }

  set = (value: number, unit: 'day' | 'minute' | 'hour' | 'year' | 'month') => {
    switch (unit) {
      case 'day':
        this.date = fns.setDay(this.date, value)
        break
      case 'hour':
        this.date = fns.setHours(this.date, value)
        break
      case 'minute':
        this.date = fns.setMinutes(this.date, value)
        break
      case 'year':
        this.date = fns.setYear(this.date, value)
        break
      case 'month':
        this.date = fns.setMonth(this.date, value)
        break
    }

    return this
  }

  eachDayUntil = (end: Date) => {
    return fns.eachDayOfInterval({
      start: this.date,
      end: parseDate(end)
    })
  }

  isDateWithinInterval = (interval: Interval) => {
    return isWithinInterval(this.date, interval)
  }

  diff = (date: Date, unit: UnitType) => {
    switch (unit) {
      case 'day':
        return fns.differenceInDays(this.date, parseDate(date))
      case 'businessDay':
        return fns.differenceInBusinessDays(this.date, parseDate(date))
      case 'month':
        return fns.differenceInMonths(parseDate(date), this.date)
      case 'year':
        return fns.differenceInYears(parseDate(date), this.date)
      case 'hour':
        return fns.differenceInHours(parseDate(date), this.date)
      case 'minute':
        return fns.differenceInMinutes(parseDate(date), this.date)
      case 'second':
        return fns.differenceInSeconds(parseDate(date), this.date)
    }
  }

  diffCalendarDays = (date: Date) => {
    return fns.differenceInCalendarDays(this.date, parseDate(date))
  }

  getDate = () => {
    return this.date
  }

  getLocaleDateString = () => {
    return fns.format(this.date, chrono.DATETIME_FORMAT, {
      locale: getLocale(),
      weekStartsOn: WEEK_STARTS_ON
    })
  }

  /** Parse the date to UTC and then toISOString() */
  toISOString = () => {
    const deserializedDate = this.date.getTime()
    const currentTimeZoneOffset = this.date.getTimezoneOffset() * 60_000

    return new Date(deserializedDate - currentTimeZoneOffset).toISOString()
  }
}

const relativeFormat = (dateToFormat: Date) => {
  // const diff = differenceInDays(startOfDay(dateToFormat), startOfDay(this.now()))
  const diff = chrono(dateToFormat)
    .startOf('day')
    .diff(chrono(chrono.now()).startOf('day').getDate(), 'day')

  const localizedFormats = {
    en: {
      sameDay: "MMM, 'Today'",
      nextDay: "MMM, 'Tomorrow'",
      nextWeek: "MMM, 'Next' eeee",
      lastDay: "MMM, 'Yesterday'",
      lastWeek: "MMM, 'Last' eeee",
      sameElse: 'MMMM'
    },
    es: {
      sameDay: "MMM, 'hoy'",
      nextDay: "MMM, 'mañana'",
      nextWeek: "MMM, 'siguiente' eeee",
      lastDay: "MMM, 'ayer'",
      lastWeek: "MMM, 'el' eeee 'pasado'",
      sameElse: 'MMMM'
    }
  }

  const isSpanishLocale = i18n.language === 'es-ES' || i18n.language === 'es'
  const formats = localizedFormats[isSpanishLocale ? 'es' : 'en']

  const formatStr =
    diff < -7
      ? formats.sameElse
      : diff < -1
      ? formats.lastWeek
      : diff < 0
      ? formats.lastDay
      : diff < 1
      ? formats.sameDay
      : diff < 2
      ? formats.nextDay
      : diff <= 7
      ? formats.nextWeek
      : formats.sameElse

  return chrono(dateToFormat).format(formatStr)
}

export const getHumanizedDuration = ({
  duration,
  abbreviation = true,
  addSign = false,
  timeUnit = TimeUnits.MINUTES
}: {
  duration: number
  abbreviation?: boolean
  addSign?: boolean
  timeUnit?: TimeUnit
}) => {
  const sign = addSign ? calculateSign(duration) : ''

  if (timeUnit === TimeUnits.DAYS || timeUnit === TimeUnits.NATURAL_DAYS) {
    const units = duration === 1 ? i18n.t('time.day') : i18n.t('time.day_plural').toLowerCase()

    return `${sign}${duration}${abbreviation ? 'd' : ` ${units}`}`
  }

  const hours = Math.abs(Math.trunc(duration / 60))
  const hoursMsg = ' ' + i18n.t('time.hour', { count: hours })

  const minutes = Math.abs(duration % 60)
  const minutesMsg = ' ' + i18n.t('time.minute', { count: minutes })

  const hMsg = hours > 0 ? `${hours}${abbreviation ? 'h' : hoursMsg}` : ''
  const separator = hours > 0 && minutes > 0 ? ' ' : ''
  const mMsg = minutes > 0 ? `${minutes}${abbreviation ? 'min' : minutesMsg}` : ''

  return sign + hMsg + separator + mMsg
}

/** Parse the date in a local time zone */
export const parseISO = (iso: string) => {
  return fns.parseISO(iso)
}

export const parse = (
  dateString: string,
  formatString: string,
  referenceDate: Date | number,
  options?: {
    firstWeekContainsDate?: 1 | 2 | 3 | 4 | 5 | 6 | 7
    useAdditionalWeekYearTokens?: boolean
    useAdditionalDayOfYearTokens?: boolean
  }
) => {
  return fns.parse(dateString, formatString, referenceDate, {
    locale: getLocale(),
    weekStartsOn: WEEK_STARTS_ON,
    ...options
  })
}

export const areIntervalsOverlapping = (
  intervalLeft: Interval,
  intervalRight: Interval,
  options?: {
    inclusive?: boolean
  }
) => {
  return fns.areIntervalsOverlapping(intervalLeft, intervalRight, options)
}

export const isSaturday = (date: Date) => {
  return fns.isSaturday(date)
}

export const isSunday = (date: Date) => {
  return fns.isSunday(date)
}

export const isWeekend = (date: Date) => {
  return fns.isWeekend(date)
}

export const isFirstDayOfMonth = (date: Date) => {
  return fns.isFirstDayOfMonth(date)
}

export const eachYearOfInterval = (interval: fns.Interval) => {
  return fns.eachYearOfInterval(interval)
}

export const eachMonthOfInterval = (interval: fns.Interval) => {
  return fns.eachMonthOfInterval(interval)
}

export const getWeeksInMonth = (targetDate: Date) => {
  return fns.getWeeksInMonth(targetDate, { locale: getLocale(), weekStartsOn: WEEK_STARTS_ON })
}

export const getMonthNames = () => {
  return [
    i18n.t('months.january'),
    i18n.t('months.february'),
    i18n.t('months.march'),
    i18n.t('months.april'),
    i18n.t('months.may'),
    i18n.t('months.june'),
    i18n.t('months.july'),
    i18n.t('months.august'),
    i18n.t('months.september'),
    i18n.t('months.october'),
    i18n.t('months.november'),
    i18n.t('months.december')
  ]
}

function calculateSign(duration: number) {
  if (duration > 0) return '+'
  if (duration < 0) return '-'
  if (duration === 0) return ''
}

export const timeOptions = (() => {
  const timeList: string[] = []
  for (let hour = 0; hour <= 23; hour++) {
    for (let minute = 0; minute <= 3; minute++) {
      const auxMin = hour <= 9 ? '0' + hour : hour
      const auxMax = minute == 0 ? '00' : minute * 15
      const aux = String(auxMin + ':' + auxMax)
      timeList.push(aux)
    }
  }
  return timeList
})()

export const getNearestTimeOption = (invalidTime: string) => {
  const [invalidHours, invalidMinutes] = invalidTime.split(':')

  const hours = timeOptions.map((timeOption) => {
    return timeOption.slice(0, 2)
  })

  const minutes = timeOptions.map((timeOption) => {
    return timeOption.slice(3, 5)
  })

  const uniqueHours = [...new Set(hours)]
  const uniqueMinutes = [...new Set(minutes)]

  const nearestHour = uniqueHours.reduce((prev, curr) => {
    return Math.abs(Number(curr) - Number(invalidHours)) <
      Math.abs(Number(prev) - Number(invalidHours))
      ? curr
      : prev
  })

  const nearestMinutes = uniqueMinutes.reduce((prev, curr) => {
    return Math.abs(Number(curr) - Number(invalidMinutes)) <
      Math.abs(Number(prev) - Number(invalidMinutes))
      ? curr
      : prev
  })

  return `${nearestHour}:${nearestMinutes}`
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
  return parse(time, 'HH:mm', backupDate ?? getUTCDate())
}

export const getLastDayOfMonth = (date: Date) => {
  const newDate = date
  newDate.setMonth(newDate.getMonth() + 1)
  newDate.setDate(0)
  return newDate
}
