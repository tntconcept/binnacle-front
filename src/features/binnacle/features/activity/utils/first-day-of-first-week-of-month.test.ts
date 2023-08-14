import { it, expect } from 'vitest'
import { chrono, parseISO } from '../../../../../shared/utils/chrono'
import { firstDayOfFirstWeekOfMonth } from './first-day-of-first-week-of-month'

it('should get first date of the first week of the month', function () {
  const date = parseISO('2019-09-10')
  const firstDateOfFirstWeekOfMonth = parseISO('2019-08-26')
  const result = firstDayOfFirstWeekOfMonth(date)

  expect(chrono(result).isSame(firstDateOfFirstWeekOfMonth, 'day')).toBeTruthy()
})
