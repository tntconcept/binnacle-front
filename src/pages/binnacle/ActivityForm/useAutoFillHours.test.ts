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

  it('should return 09:00 - 13:00 if lastEndTime is undefined', function() {
    const { result } = renderHook(() => useAutoFillHours(true, hoursIntervalMock, undefined))

    expect(result.current).toEqual({
      startTime: '09:00',
      endTime: '13:00'
    })
  })

  it('should return 14:00 - 18:00 if the lastEndTime is 13:00', function() {
    const date = new Date('10-10-2010 13:00')
    const { result } = renderHook(() => useAutoFillHours(true, hoursIntervalMock, date))

    expect(result.current).toEqual({
      startTime: '14:00',
      endTime: '18:00'
    })
  })

  it('should return 14:00 - 18:00 if the lastEndTime is 14:00', function() {
    const date = new Date('10-10-2010 14:00')
    const { result } = renderHook(() => useAutoFillHours(true, hoursIntervalMock, date))

    expect(result.current).toEqual({
      startTime: '14:00',
      endTime: '18:00'
    })
  })

  it('should return 20:00 - 21:00 if the lastEndTime is greater than 18:00', function() {
    const date = new Date('10-10-2010 20:00')
    const { result } = renderHook(() => useAutoFillHours(true, hoursIntervalMock, date))

    expect(result.current).toEqual({
      startTime: '20:00',
      endTime: '21:00'
    })
  })

  it('should return 11:00 - 13:00 if the lastEndTime was before 13:00', function() {
    const date = new Date('10-10-2010 11:00')
    const { result } = renderHook(() => useAutoFillHours(true, hoursIntervalMock, date))

    expect(result.current).toEqual({
      startTime: '11:00',
      endTime: '13:00'
    })
  })

  it('should return 15:00 - 18:00 if the lastEndTime is 15:00', function() {
    const date = new Date('10-10-2010 15:00')
    const { result } = renderHook(() => useAutoFillHours(true, hoursIntervalMock, date))

    expect(result.current).toEqual({
      startTime: '15:00',
      endTime: '18:00'
    })
  })

  it('should return 14:00 - 18:00 if the lastEndTime is between 13:00 - 14:00', function() {
    const date = new Date('10-10-2010 13:45')
    const { result } = renderHook(() => useAutoFillHours(true, hoursIntervalMock, date))

    expect(result.current).toEqual({
      startTime: '14:00',
      endTime: '18:00'
    })
  })

  it('should return 18:00 - 19:00 if the lastEndTime is 18:00', function() {
    const date = new Date('10-10-2010 18:00')
    const { result } = renderHook(() => useAutoFillHours(true, hoursIntervalMock, date))

    expect(result.current).toEqual({
      startTime: '18:00',
      endTime: '19:00'
    })
  })
})
