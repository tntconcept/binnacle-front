import { getDaysOfWeek, getNextWeek, getPreviousWeek } from 'modules/binnacle/page/BinnacleMobile/BinnacleScreen/CalendarWeek/CalendarWeek.utils'

describe('Calendar week', () => {
  const date = new Date('2020-01-31T20:10:00.000Z')

  it('should return each day of week', function() {
    const result = getDaysOfWeek(date)
    expect(result).toMatchInlineSnapshot(`
      Array [
        2020-01-26T23:00:00.000Z,
        2020-01-27T23:00:00.000Z,
        2020-01-28T23:00:00.000Z,
        2020-01-29T23:00:00.000Z,
        2020-01-30T23:00:00.000Z,
        2020-01-31T23:00:00.000Z,
        2020-02-01T23:00:00.000Z,
      ]
    `)
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
