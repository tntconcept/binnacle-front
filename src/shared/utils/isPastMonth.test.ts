import { isPastMonth } from './isPastMonth'

describe('isPastMonth', () => {
  it('Should return true if the target year is less than the current year', () => {
    const date = new Date('2019-01-01')
    const result = isPastMonth(date)
    expect(result).toBe(true)
  })

  it('Should return false if the target year is greater than the current year', () => {
    const now = new Date()
    const date = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
    const result = isPastMonth(date)
    expect(result).toBe(false)
  })

  it('Should return true if year is equal and month is less than the current month', () => {
    const now = new Date()
    const date = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    const result = isPastMonth(date)
    expect(result).toBe(true)
  })

  it('Should return false if year is equal and month is equal', () => {
    const now = new Date()
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const result = isPastMonth(date)
    expect(result).toBe(false)
  })

  it('Should return false if year is equal and month is greater', () => {
    const now = new Date('2022-12-01')
    const date = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())
    const result = isPastMonth(date)
    expect(result).toBe(false)
  })
})
