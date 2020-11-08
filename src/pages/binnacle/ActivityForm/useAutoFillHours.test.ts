import { renderHook } from '@testing-library/react-hooks'
import { roundHourToQuarters, useAutoFillHours } from 'pages/binnacle/ActivityForm/useAutoFillHours'

describe('useAutoFillHours', () => {
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

  const hoursIntervalMock = ['09:00', '13:00', '14:00', '18:00']

  // last end time, expected start time, expected end time
  const cases = [
    ['08:00', '09:00', '13:00'],
    [undefined, '09:00', '13:00'],
    ['11:00', '11:00', '13:00'],
    ['13:00', '14:00', '18:00'],
    ['13:30', '14:00', '18:00'],
    ['13:45', '14:00', '18:00'],
    ['14:00', '14:00', '18:00'],
    ['15:00', '15:00', '18:00'],
    ['18:00', '18:00', '19:00'],
    ['20:00', '20:00', '21:00']
  ] as const

  test.each(cases)(
    'given %p as lastEndTime, returns %p - %p interval',
    (lastEndTime, startTime, endTime) => {
      const lastTimeImputed = lastEndTime ? new Date(`10-10-2010 ${lastEndTime}`) : undefined
      const { result } = renderHook(() =>
        useAutoFillHours(true, hoursIntervalMock, lastTimeImputed)
      )

      expect(result.current).toEqual({
        startTime: startTime,
        endTime: endTime
      })
    }
  )
})
