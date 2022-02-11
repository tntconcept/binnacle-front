import { firstDayOfFirstWeekOfMonth } from 'modules/binnacle/data-access/utils/firstDayOfFirstWeekOfMonth'
import chrono, { parseISO } from 'shared/utils/chrono'

test('should get first date of the first week of the month', function () {
  const date = parseISO('2019-09-10')
  const firstDateOfFirstWeekOfMonth = parseISO('2019-08-26')
  const result = firstDayOfFirstWeekOfMonth(date)

  expect(chrono(result).isSame(firstDateOfFirstWeekOfMonth, 'day')).toBeTruthy()
})
