import { describe, expect, it } from 'vitest'
import {
  getDurationByHours,
  getDurationByMinutes,
  getDurationByTimeUnit,
  roundToTwoDecimals
} from './get-duration'
import { TimeUnit } from '../../../../../shared/types/time-unit'

describe('getDuration', () => {
  it('should format activity duration in decimal format with minutes', function () {
    const result1 = getDurationByMinutes(4 * 60, true)
    expect(result1).toEqual(4)

    const result2 = getDurationByMinutes(4.25 * 60, true)
    expect(result2).toEqual(4.25)

    const result3 = getDurationByMinutes(0, true)
    expect(result3).toEqual(0)
  })

  it('should format activity duration in decimal format with hours', function () {
    const result1 = getDurationByHours(4, true)
    expect(result1).toEqual(4)

    const result2 = getDurationByHours(4.25, true)
    expect(result2).toEqual(4.25)

    const result3 = getDurationByHours(0, true)
    expect(result3).toEqual(0)
  })

  it('should format activity duration in decimal format with 2 decimal digits', function () {
    const result1 = getDurationByHours(4.254567, true)
    expect(result1).toEqual(4.25)

    const result2 = getDurationByHours(0, true)
    expect(result2).toEqual(0)
  })

  it('should format activity duration in humanized format with minutes', function () {
    const result1 = getDurationByMinutes(4 * 60, false)
    expect(result1).toEqual('4h')

    const result2 = getDurationByMinutes(4.25 * 60, false)
    expect(result2).toEqual('4h 15min')

    const result3 = getDurationByMinutes(0, false)
    expect(result3).toEqual('0h')
  })

  it('should format activity duration in humanized format with hours', function () {
    const result1 = getDurationByHours(4, false)
    expect(result1).toEqual('4h')

    const result2 = getDurationByHours(4.5, false)
    expect(result2).toEqual('4h 30min')

    const result3 = getDurationByHours(0, false)
    expect(result3).toEqual('0h')
  })

  it('should round to two decimals', () => {
    expect(roundToTwoDecimals(3.254)).toBe(3.25)
    expect(roundToTwoDecimals(3.255)).toBe(3.26)
    expect(roundToTwoDecimals(3.258)).toBe(3.26)
  })

  it.each([
    [30, 'MINUTES', '30min'],
    [60, 'MINUTES', '1h'],
    [90, 'MINUTES', '1h 30min'],
    [0, 'MINUTES', '0h'],
    [0.0, 'MINUTES', '0h'],
    [1, 'DAYS', '1d'],
    [0, 'DAYS', '0d'],
    [0.0, 'DAYS', '0d'],
    [1, 'NATURAL_DAYS', '1d'],
    [0, 'NATURAL_DAYS', '0d'],
    [0.0, 'NATURAL_DAYS', '0d']
  ])(
    'should format activity duration in humanized format based in time unit',
    (time, unit, expected) => {
      expect(getDurationByTimeUnit(time, unit as TimeUnit)).toBe(expected)
    }
  )
})
