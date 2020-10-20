import { getDuration, getTimeInterval, roundHourToQuarters } from 'utils/TimeUtils'
import {
  firstDayOfFirstWeekOfMonth,
  getDatesIntervalByMonth,
  lastDayOfLastWeekOfMonth,
  getDaysOfWeek,
  getPreviousWeek,
  getNextWeek
} from 'utils/DateUtils'

describe('Time utils', () => {
  const date = new Date('2020-01-31T20:10:00.000Z')

  it('should format activity time range', function() {
    const result = getTimeInterval(date, 2 * 60)
    expect(result).toEqual('21:10 - 23:10')
  })

  it('should round minute to 15', function() {
    const result1 = roundHourToQuarters(new Date('2020-01-31T20:10:00.000Z'))
    expect(result1).toEqual(new Date('2020-01-31T20:15:00.000Z'))

    const result2 = roundHourToQuarters(new Date('2020-01-31T20:05:00.000Z'))
    expect(result2).toEqual(new Date('2020-01-31T20:00:00.000Z'))

    const result3 = roundHourToQuarters(new Date('2020-01-31T20:00:00.000Z'))
    expect(result3).toEqual(new Date('2020-01-31T20:00:00.000Z'))

    const result4 = roundHourToQuarters(new Date('2020-01-31T20:15:00.000Z'))
    expect(result4).toEqual(new Date('2020-01-31T20:15:00.000Z'))
  })

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

  it('should return the first day of the first week of the month', function() {
    const result = firstDayOfFirstWeekOfMonth(date)
    expect(result).toEqual(new Date('2019-12-29T23:00:00.000Z'))
  })

  it('should return last day of the last week of the month', function() {
    const result = lastDayOfLastWeekOfMonth(date)
    expect(result).toEqual(new Date('2020-02-02T22:59:59.999Z'))
  })

  it('should return each day of month', function() {
    const result = getDatesIntervalByMonth(date)
    expect(result).toMatchSnapshot()
  })

  it('should return each day of week', function() {
    const result = getDaysOfWeek(date)
    expect(result).toMatchSnapshot()
  })

  it('should return previous week', function() {
    const result = getPreviousWeek(date)
    expect(result).toEqual(new Date('2020-01-24T20:10:00.000Z'))
  })

  it('should return next week', function() {
    const result = getNextWeek(date)
    expect(result).toEqual(new Date('2020-02-07T20:10:00.000Z'))
  })
})
