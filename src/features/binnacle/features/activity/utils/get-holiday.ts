import { chrono } from '../../../../../shared/utils/chrono'
import { Holiday } from '../../holiday/domain/holiday'

export const getHoliday = (publicHolidays: Holiday[], date: Date) =>
  publicHolidays.find((holiday) => chrono(holiday.date).isSame(date, 'day'))
