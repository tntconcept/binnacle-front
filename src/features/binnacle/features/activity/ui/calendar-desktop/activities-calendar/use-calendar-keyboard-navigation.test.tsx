import { describe, expect, it, vi } from 'vitest'
import { eachDayOfInterval } from 'date-fns'
import { render, screen, userEvent } from '../../../../../../../test-utils/render'
import { firstDayOfFirstWeekOfMonth } from '../../../utils/first-day-of-first-week-of-month'
import { lastDayOfLastWeekOfMonth } from '../../../utils/last-day-of-last-week-of-month'
import { useCalendarKeysNavigation } from './use-calendar-keyboard-navigation'

describe('useCalendarKeyboardNavigation', () => {
  it('should navigate RIGHT if possible', async () => {
    vi.useFakeTimers().setSystemTime(new Date('2021-07-31').getTime())
    setup(new Date('2021-07-31'))
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })

    // 1. focus the active cell
    await user.tab()

    // 2. go to the last day of the calendar
    await user.keyboard('{ArrowRight}')
    expect(screen.getByText('1/8')).toHaveFocus()

    // 3. press the right arrow again, should not change the active cell
    // because there are no more cells to the right
    await user.keyboard('{ArrowRight}')
    expect(screen.getByText('1/8')).toHaveFocus()

    jest.useRealTimers()
  })

  it('should navigate LEFT if possible', async () => {
    setup(new Date('2021-06-01'))

    // 1. focus the active cell
    await userEvent.tab()

    // 2. go to the first day of the calendar
    await userEvent.keyboard('{ArrowLeft}')
    expect(screen.getByText('31/5')).toHaveFocus()

    // 3. press the left arrow again, should not change the active cell
    // because there are no more cells to the left
    await userEvent.keyboard('{ArrowLeft}')

    expect(screen.getByText('31/5')).toHaveFocus()
  })

  it('should navigate UP if possible', async () => {
    vi.useFakeTimers().setSystemTime(new Date('2021-06-07').getTime())
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })

    setup(new Date('2021-06-07'))

    // 1. focus the active cell
    await user.tab()
    // 2. go to the first row of the calendar
    await user.keyboard('{ArrowUp}')
    expect(screen.getByText('31/5')).toHaveFocus()
    // 3. press the up arrow again, should not change the active cell
    // because there are no more rows above it
    await user.keyboard('{ArrowUp}')
    expect(screen.getByText('31/5')).toHaveFocus()

    jest.useRealTimers()
  })

  it('should navigate DOWN if possible', async () => {
    vi.useFakeTimers().setSystemTime(new Date('2021-06-24').getTime())
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })

    setup(new Date('2021-06-24'))

    // 1. focus the active cell
    await user.tab()

    // 2. go to the last row of the calendar
    await user.keyboard('{ArrowDown}')
    expect(screen.getByText('1/7')).toHaveFocus()

    // 3. press the down arrow again, should not change the active cell
    // because there are no more rows under it
    await user.keyboard('{ArrowDown}')
    expect(screen.getByText('1/7')).toHaveFocus()

    jest.useRealTimers()
  })

  it('should focus today', async () => {
    vi.useFakeTimers().setSystemTime(new Date('2021-07-05').getTime())
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })

    const { mockSetSelectedCell, outerClickHandler } = setup(new Date('2021-07-05'))

    // 1. focus the active cell
    await user.tab()

    // 2. press the enter key
    await user.keyboard('{Enter}')

    expect(mockSetSelectedCell).toHaveBeenCalledWith(7)
    expect(outerClickHandler).not.toHaveBeenCalled()

    jest.useRealTimers()
  })

  it('should focus the first day of month when select date is in another month', async () => {
    vi.useFakeTimers().setSystemTime(new Date('2021-07-05').getTime())
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })

    const { mockSetSelectedCell, outerClickHandler } = setup(new Date('2021-06-11'))

    // 1. focus the active cell
    await user.tab()

    // 2. press the enter key
    await user.keyboard('{Enter}')

    expect(mockSetSelectedCell).toHaveBeenCalledWith(1)
    expect(outerClickHandler).not.toHaveBeenCalled()

    jest.useRealTimers()
  })
})

const setup = (selectedDate: Date) => {
  const mockSetSelectedCell = vi.fn()
  const outerClickHandler = vi.fn()

  const Calendar = () => {
    const { calendarRef, registerCellRef } = useCalendarKeysNavigation(
      selectedDate,
      mockSetSelectedCell
    )

    const cells = eachDayOfInterval({
      start: firstDayOfFirstWeekOfMonth(selectedDate),
      end: lastDayOfLastWeekOfMonth(selectedDate)
    })

    return (
      <div ref={calendarRef} data-testid="calendar">
        <div onClick={outerClickHandler}>
          {cells.map((cell, index) => (
            <button key={index} ref={registerCellRef(index)}>
              {cell.getDate()}/{cell.getMonth() + 1}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return {
    mockSetSelectedCell,
    outerClickHandler,
    ...render(<Calendar />, {
      avoidChakraProvider: true
    })
  }
}
