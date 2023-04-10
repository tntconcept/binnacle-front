import type { Vacation } from 'shared/types/Vacation'
import chrono from 'shared/utils/chrono'

export const getVacation = (vacations: Vacation[], date: Date) =>
  vacations.find((vacation) => vacation.days.some((day) => chrono(day).isSame(date, 'day')))
