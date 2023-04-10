import type { Holiday } from 'shared/types/Holiday'
import chrono from 'shared/utils/chrono'

export const getHoliday = (publicHolidays: Holiday[], date: Date) =>
  publicHolidays.find((holiday) => chrono(holiday.date).isSame(date, 'day'))
