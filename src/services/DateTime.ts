import i18n from 'app/i18n'
import {
  addDays,
  addMonths,
  differenceInDays,
  endOfMonth,
  format,
  isAfter,
  isBefore,
  isFirstDayOfMonth,
  isSameDay,
  isSameMonth,
  isThisMonth,
  startOfDay,
  startOfMonth,
  subDays,
  subMonths
} from 'date-fns'
import { es } from 'date-fns/locale'

const WEEK_STARTS_ON = 1
const LOCALE = i18n.language === 'es-ES' || i18n.language === 'es' ? es : undefined // fallback of date-fns is en-US

class DateTime {
  static now(): Date {
    return new Date()
  }

  static format(date: Date, formatStr: string): string {
    return format(date, formatStr, {
      locale: LOCALE,
      weekStartsOn: WEEK_STARTS_ON
    })
  }

  static isBefore(date: Date, dateToCompare: Date): boolean {
    return isBefore(date, dateToCompare)
  }

  static isAfter(date: Date, dateToCompare: Date): boolean {
    return isAfter(date, dateToCompare)
  }

  static isSameDay(dateLeft: Date, dateRight: Date): boolean {
    return isSameDay(dateLeft, dateRight)
  }

  static addDays(date: Date, amount: number): Date {
    return addDays(date, amount)
  }

  static subDays(date: Date, amount: number): Date {
    return subDays(date, amount)
  }

  static isThisMonth(date: Date): boolean {
    return isThisMonth(date)
  }

  static isSameMonth(dateLeft: Date, dateRight: Date): boolean {
    return isSameMonth(dateLeft, dateRight)
  }

  static isFirstDayOfMonth(date: Date): boolean {
    return isFirstDayOfMonth(date)
  }

  static addMonths(date: Date, amount: number): Date {
    return addMonths(date, amount)
  }

  static subMonths(date: Date, amount: number): Date {
    return subMonths(date, amount)
  }

  static startOfMonth(date: Date): Date {
    return startOfMonth(date)
  }

  static endOfMonth(date: Date): Date {
    return endOfMonth(date)
  }

  static getHumanizedDuration(
    durationMin: number,
    abbreviation: boolean = true
  ): string {
    const hours = Math.abs(Math.trunc(durationMin / 60))
    const hoursMsg = ' ' + i18n.t('time.hour', { count: hours })
    const minutes = Math.abs(durationMin % 60)
    const minutesMsg = ' ' + i18n.t('time.minute', { count: minutes })

    const hMsg = hours > 0 ? `${hours}${abbreviation ? 'h' : hoursMsg}` : ''
    const mMsg = minutes > 0 ? ` ${minutes}${abbreviation ? 'm' : minutesMsg}` : ''

    return hMsg + mMsg
  }

  static relativeFormat(dateToFormat: Date) {
    const diff = differenceInDays(startOfDay(dateToFormat), startOfDay(this.now()))

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

    return this.format(dateToFormat, formatStr)
  }
}

export default DateTime
