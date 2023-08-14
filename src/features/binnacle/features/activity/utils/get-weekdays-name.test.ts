import { describe, expect, it } from 'vitest'
import { getWeekdaysName } from './get-weekdays-name'
import * as chronoUtils from '../../../../../shared/utils/chrono'

describe('getWeekdaysName', () => {
  it('should return weekdays in Spanish if isSpanishLocale returns true', () => {
    jest.spyOn(chronoUtils, 'isSpanishLocale').mockReturnValue(true)

    const result = getWeekdaysName()
    expect(result).toEqual(['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'])
  })

  it('should return weekdays in English if isSpanishLocale returns false', () => {
    jest.spyOn(chronoUtils, 'isSpanishLocale').mockReturnValue(false)

    const result = getWeekdaysName()
    expect(result).toEqual(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'])
  })
})
