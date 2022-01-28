import type { Vacation } from 'shared/types/Vacation'
import chrono from 'shared/utils/chrono'

export const getVacation = (privateHolidays: Vacation[], date: Date) =>
  privateHolidays.find((vacation) => vacation.days.some((day) => chrono(day).isSame(date, 'day')))
