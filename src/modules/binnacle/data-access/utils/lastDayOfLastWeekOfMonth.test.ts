import { lastDayOfLastWeekOfMonth } from 'modules/binnacle/data-access/utils/lastDayOfLastWeekOfMonth'
import chrono, { parseISO } from 'shared/utils/chrono'

test('should get last date of the last week of the month', function () {
  const date = parseISO('2019-09-10')
  const lastDateOfLastWeekOfMonth = parseISO('2019-10-06')
  const result = lastDayOfLastWeekOfMonth(date)
  expect(chrono(result).isSame(lastDateOfLastWeekOfMonth, 'day')).toBeTruthy()
})
