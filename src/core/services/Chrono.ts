import * as fns from 'date-fns'
import i18n from 'core/i18n/i18n'
import { es } from 'date-fns/locale'

export function isSpanishLocale() {
  return i18n.language === 'es-ES' || i18n.language === 'es'
}

function getLocale() {
  return isSpanishLocale() ? es : undefined // fallback of date-fns is en-US
}

type UnitType = 'day' | 'month' | 'year' | 'hour' | 'minute' | 'second'

const WEEK_STARTS_ON = 1

export default function chrono(date?: Date | string) {
  const d = typeof date === 'string' ? parseISO(date) : date || chrono.now
  return new Chrono(d)
}

chrono.TIME_FORMAT = 'HH:mm'
chrono.DATE_FORMAT = 'yyyy-MM-dd'
chrono.now = new Date() as Date

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
        return fns.isSameDay(this.date, date)
      case 'month':
        return fns.isSameMonth(this.date, date)
      case 'year':
        return fns.isSameYear(this.date, date)
      case 'hour':
        return fns.isSameHour(this.date, date)
      case 'minute':
        return fns.isSameMinute(this.date, date)
      case 'second':
        return fns.isSameSecond(this.date, date)
      default: {
        return fns.isEqual(this.date, date)
      }
    }
  }

  isBefore = (date: Date) => {
    return fns.isBefore(this.date, date)
  }

  isAfter = (date: Date) => {
    return fns.isAfter(this.date, date)
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

  set = (value: number, unit: 'day' | 'minute' | 'hour' | 'year') => {
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
    }

    return this
  }

  eachDayUntil = (end: Date) => {
    return fns.eachDayOfInterval({
      start: this.date,
      end: end
    })
  }

  diff = (date: Date, unit: UnitType) => {
    switch (unit) {
      case 'day':
        return fns.differenceInDays(this.date, date)
      case 'month':
        return fns.differenceInMonths(date, this.date)
      case 'year':
        return fns.differenceInYears(date, this.date)
      case 'hour':
        return fns.differenceInHours(date, this.date)
      case 'minute':
        return fns.differenceInMinutes(date, this.date)
      case 'second':
        return fns.differenceInSeconds(date, this.date)
    }
  }

  getDate = () => {
    return this.date
  }

  /** Parse the date to UTC and then toISOString() */
  toISOString = () => {
    let deserializedDate = this.date.getTime()
    let currentTimeZoneOffset = this.date.getTimezoneOffset() * 60_000

    return new Date(deserializedDate - currentTimeZoneOffset).toISOString()
  }
}

const relativeFormat = (dateToFormat: Date) => {
  // const diff = differenceInDays(startOfDay(dateToFormat), startOfDay(this.now()))
  const diff = chrono(dateToFormat)
    .startOf('day')
    .diff(
      chrono(chrono.now)
        .startOf('day')
        .getDate(),
      'day'
    )

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

  // return this.format(dateToFormat, formatStr)
  return chrono(dateToFormat).format(formatStr)
}

export const getHumanizedDuration = (durationMin: number, abbreviation: boolean = true) => {
  const hours = Math.abs(Math.trunc(durationMin / 60))
  const hoursMsg = ' ' + i18n.t('time.hour', { count: hours })
  const minutes = Math.abs(durationMin % 60)
  const minutesMsg = ' ' + i18n.t('time.minute', { count: minutes })

  const hMsg = hours > 0 ? `${hours}${abbreviation ? 'h' : hoursMsg}` : ''
  const mMsg = minutes > 0 ? ` ${minutes}${abbreviation ? 'm' : minutesMsg}` : ''

  return hMsg + mMsg
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

export const isFirstDayOfMonth = (date: Date) => {
  return fns.isFirstDayOfMonth(date)
}

export const esLocale = es

export const eachYearOfInterval = (interval: fns.Interval) => {
  return fns.eachYearOfInterval(interval)
}
