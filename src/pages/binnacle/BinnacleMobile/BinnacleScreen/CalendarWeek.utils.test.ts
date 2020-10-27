import {
  getDaysOfWeek,
  getNextWeek,
  getPreviousWeek
} from 'pages/binnacle/BinnacleMobile/BinnacleScreen/CalendarWeek.utils'

describe('Calendar week', () => {
  const date = new Date('2020-01-31T20:10:00.000Z')

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
