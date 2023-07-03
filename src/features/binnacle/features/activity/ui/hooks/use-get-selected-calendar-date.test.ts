import { renderHook } from '@testing-library/react-hooks'
import { chrono } from '../../../../../../shared/utils/chrono'
import { useGetSelectedCalendarDate } from './use-get-selected-calendar-date'

describe('useGetSelectedCalendarDate', () => {
  it('should return the current date', () => {
    const selectedDate: Date = chrono.now()
    const currentDate = new Date(chrono(selectedDate).format(chrono.DATE_FORMAT))

    const { result } = renderHook(() => useGetSelectedCalendarDate(selectedDate))

    expect(result.current).toEqual(currentDate)
  })

  it('should return the last month of the selected year', () => {
    const pastDate = new Date(2020, 6, 1) // Jun 1, 2020

    const { result } = renderHook(() => useGetSelectedCalendarDate(pastDate))

    const expectedPastDate = new Date(`${pastDate.getFullYear()}-12-31`)
    expect(result.current).toEqual(expectedPastDate)
  })

  it('should return the first month of the selected year', () => {
    const nextDate = new Date(2024, 7, 2) // July 2, 2024

    const { result } = renderHook(() => useGetSelectedCalendarDate(nextDate))

    const expectedNextDate = new Date(`${nextDate.getFullYear()}-01-01`)
    expect(result.current).toEqual(expectedNextDate)
  })
})
