import { renderHook } from '@testing-library/react-hooks'
import { useGetSelectedCalendarDate } from './use-get-selected-calendar-date'
import chrono from '../../../../../../shared/utils/chrono'

describe('useGetSelectedCalendarDate', () => {
  const today = new Date('2023-06-02T00:00:00.000Z')

  it('should return the current date', () => {
    chrono.now = jest.fn(() => today)
    const selectedDate: Date = today

    const hook = renderHook(() => useGetSelectedCalendarDate(selectedDate))

    expect(hook.result.current).toBe(selectedDate)
  })
})
