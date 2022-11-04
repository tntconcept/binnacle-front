/**
 * [v] Should call isPastDate with a target date
 *
 * [] Should return true if the target year is less than the current year
 * [] Should return false if the target year is gte the current year
 *
 * [] Should return true if the target month is less than the current month
 * [] Should return false if the target month is gte the current month
 */

import { isPastDate } from './isPastDate'

describe('isPastDate', () => {
  it('Should return true if the target year is less than the current year', () => {
    const date = new Date('2019-01-01')
    const result = isPastDate(date)
    expect(result).toBe(true)
  })
})
