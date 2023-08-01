import { getDaysOfWeek, getPreviousWeek, getNextWeek } from './calendar-week.utils'

describe('Calendar week', () => {
  const date = new Date('2020-01-31T20:10:00.000Z')

  it('should return each day of week', function () {
    const result = getDaysOfWeek(date)
    expect(result).toMatchInlineSnapshot(`
      [
        2020-01-27T00:00:00.000Z,
        2020-01-28T00:00:00.000Z,
        2020-01-29T00:00:00.000Z,
        2020-01-30T00:00:00.000Z,
        2020-01-31T00:00:00.000Z,
        2020-02-01T00:00:00.000Z,
        2020-02-02T00:00:00.000Z,
      ]
    `)
  })

  it('should return previous week', function () {
    const result = getPreviousWeek(date)
    expect(result).toEqual(new Date('2020-01-24T20:10:00.000Z'))
  })

  it('should return next week', function () {
    const result = getNextWeek(date)
    expect(result).toEqual(new Date('2020-02-07T20:10:00.000Z'))
  })
})
