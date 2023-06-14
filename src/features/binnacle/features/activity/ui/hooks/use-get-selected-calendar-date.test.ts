import { renderHook } from '@testing-library/react-hooks'
import { useGetSelectedCalendarDate } from './use-get-selected-calendar-date'
import chrono from '../../../../../../shared/utils/chrono'

describe('useGetSelectedCalendarDate', () => {
  const today = new Date(2023, 6, 2)

  it('should return the current date', () => {
    chrono.now = jest.fn(() => today)
    const selectedDate: Date = today

    const { result } = renderHook(() => useGetSelectedCalendarDate(selectedDate))

    expect(result.current).toBe(selectedDate)
  })

  it('should return the last month of the selected year', () => {
    const pastDate = new Date(2020, 6, 1) // Jun 1, 2020

    const { result } = renderHook(() => useGetSelectedCalendarDate(pastDate))

    const expectedPastDate = new Date(`${pastDate.getFullYear()}-12-01`)
    expect(result.current).toEqual(expectedPastDate)
  })

  it('should return the first month of the selected year', () => {
    const nextDate = new Date(2024, 7, 2) // July 2, 2024

    const { result } = renderHook(() => useGetSelectedCalendarDate(nextDate))

    const expectedNextDate = new Date(`${nextDate.getFullYear()}-01-01`)
    expect(result.current).toEqual(expectedNextDate)
  })
})
