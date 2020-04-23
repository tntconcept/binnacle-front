import i18n from "i18n"
import {addMonths, format, subMonths} from "date-fns"
import {es} from "date-fns/locale"

const WEEK_STARTS_ON =  1;
const LOCALE = i18n.language === "es-ES" ? es : undefined // fallback of date-fns is en-US

class DateTime {
  static format(date: Date, formatStr: string): string {
    return format(date, formatStr, {
      locale: LOCALE,
      weekStartsOn: WEEK_STARTS_ON
    })
  }

  static addMonths(date: Date, amount: number): Date {
    return addMonths(date, amount)
  }

  static subMonths(date: Date, amount: number): Date {
    return subMonths(date, amount)
  }

}

export default DateTime