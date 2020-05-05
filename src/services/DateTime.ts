import i18n from "i18n"
import {addMonths, format, isAfter, isFirstDayOfMonth, isThisMonth, startOfMonth, subMonths} from "date-fns"
import {es} from "date-fns/locale"

const WEEK_STARTS_ON =  1;
const LOCALE = i18n.language === "es-ES" ? es : undefined // fallback of date-fns is en-US

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

  static isAfter(date: Date, dateToCompare: Date): boolean {
    return isAfter(date, dateToCompare)
  }

  static isThisMonth(date: Date): boolean {
    return isThisMonth(date)
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

  static getHumanizedDuration(durationMin: number, abbreviation: boolean = true): string {
    const hours = Math.abs(Math.trunc(durationMin / 60));
    const hoursMsg = " " +i18n.t('time.hour', {count: hours});
    const minutes = Math.abs(durationMin % 60);
    const minutesMsg = " " +i18n.t('time.minute', {count: minutes});

    const hMsg = hours > 0 ? `${hours}${abbreviation ? "h" : hoursMsg}` : ""
    const mMsg = minutes > 0 ? ` ${minutes}${abbreviation ? "m" : minutesMsg}` : ""

    return hMsg + mMsg
  };


}

export default DateTime