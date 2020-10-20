import {
  firstDayOfFirstWeekOfMonth,
  getDatesIntervalByMonth,
  lastDayOfLastWeekOfMonth
} from 'utils/DateUtils'
import chrono, { parseISO } from 'services/Chrono'

describe('Date utilities', () => {
  it('should get first date of the first week of the month', function() {
    const date = parseISO('2019-09-10')
    const firstDateOfFirstWeekOfMonth = parseISO('2019-08-26')
    const result = firstDayOfFirstWeekOfMonth(date)

    expect(chrono(result).isSame(firstDateOfFirstWeekOfMonth, 'day')).toBeTruthy()
  })

  it('should get last date of the last week of the month', function() {
    const date = parseISO('2019-09-10')
    const lastDateOfLastWeekOfMonth = parseISO('2019-10-06')
    const result = lastDayOfLastWeekOfMonth(date)
    expect(chrono(result).isSame(lastDateOfLastWeekOfMonth, 'day')).toBeTruthy()
  })

  it('should get all dates of the month with the whole weeks', function() {
    const date = parseISO('2019-09-10')
    const result = getDatesIntervalByMonth(date)
    expect(result.length).toBe(42)
  })
})
