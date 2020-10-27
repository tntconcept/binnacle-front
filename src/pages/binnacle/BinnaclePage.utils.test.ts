import {
  firstDayOfFirstWeekOfMonth,
  getDuration,
  getTimeInterval,
  lastDayOfLastWeekOfMonth,
  roundToTwoDecimals
} from 'pages/binnacle/BinnaclePage.utils'
import chrono, { parseISO } from 'core/services/Chrono'

describe('Binnacle page utils', () => {
  const date = new Date('2020-01-31T20:10:00.000Z')

  it('should format activity duration in decimal format', function() {
    const result1 = getDuration(4 * 60, true)
    expect(result1).toEqual(4)

    const result2 = getDuration(4.25 * 60, true)
    expect(result2).toEqual(4.25)

    const result3 = getDuration(0 * 60, true)
    expect(result3).toEqual(0)
  })

  it('should format activity duration in humanized format', function() {
    const result1 = getDuration(4 * 60, false)
    expect(result1).toEqual('4h')

    const result2 = getDuration(4.25 * 60, false)
    expect(result2).toEqual('4h 15m')

    const result3 = getDuration(0 * 60, false)
    expect(result3).toEqual('0h')
  })

  it('should format activity time range', function() {
    const result = getTimeInterval(date, 2 * 60)
    expect(result).toEqual('21:10 - 23:10')
  })

  it('should return the first day of the first week of the month', function() {
    const result = firstDayOfFirstWeekOfMonth(date)
    expect(result).toEqual(new Date('2019-12-29T23:00:00.000Z'))
  })

  it('should return last day of the last week of the month', function() {
    const result = lastDayOfLastWeekOfMonth(date)
    expect(result).toEqual(new Date('2020-02-02T22:59:59.999Z'))
  })

  it('should round to two decimals', () => {
    expect(roundToTwoDecimals(3.254)).toBe(3.25)
    expect(roundToTwoDecimals(3.255)).toBe(3.26)
    expect(roundToTwoDecimals(3.258)).toBe(3.26)
  })

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
})
