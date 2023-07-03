import { chrono } from 'shared/utils/chrono'
import { Vacation } from '../../vacation/domain/vacation'

export const getVacation = (vacations: Vacation[], date: Date) =>
  vacations.find((vacation) => vacation.days.some((day) => chrono(day).isSame(date, 'day')))
