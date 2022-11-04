/**
 * [] Should call isPastDate with a target date
 *
 * [] Should return true if the target year is less than the current year
 * [] Should return false if the target year is gte the current year
 *
 * [] Should return true if the target month is less than the current month
 * [] Should return false if the target month is gte the current month
 */

import { isPastDate } from './isPastDate'

describe('isPastDate', () => {
  it('Should call isPastDate with a target date', () => {
    const date = new Date()
    isPastDate(date)
  })
})
