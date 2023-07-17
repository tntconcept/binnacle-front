import { eachDayOfInterval } from 'date-fns'
import { render, screen, userEvent } from '../../../../../../../test-utils/app-test-utils'
import { firstDayOfFirstWeekOfMonth } from '../../../utils/first-day-of-first-week-of-month'
import { lastDayOfLastWeekOfMonth } from '../../../utils/last-day-of-last-week-of-month'
import { useCalendarKeysNavigation } from './use-calendar-keyboard-navigation'

describe('useCalendarKeyboardNavigation', () => {
  it('should navigate RIGHT if possible', () => {
    jest.useFakeTimers().setSystemTime(new Date('2021-07-31').getTime())
    setup(new Date('2021-07-31'))

    // 1. focus the active cell
    userEvent.tab()

    // 2. go to the last day of the calendar
    userEvent.keyboard('{ArrowRight}')
    expect(screen.getByText('1/8')).toHaveFocus()

    // 3. press the right arrow again, should not change the active cell
    // because there are no more cells to the right
    userEvent.keyboard('{ArrowRight}')
    expect(screen.getByText('1/8')).toHaveFocus()

    jest.useRealTimers()
  })

  it('should navigate LEFT if possible', () => {
    setup(new Date('2021-06-01'))

    // 1. focus the active cell
    userEvent.tab()

    // 2. go to the first day of the calendar
    userEvent.keyboard('{ArrowLeft}')
    expect(screen.getByText('31/5')).toHaveFocus()

    // 3. press the left arrow again, should not change the active cell
    // because there are no more cells to the left
    userEvent.keyboard('{ArrowLeft}')
    expect(screen.getByText('31/5')).toHaveFocus()
  })

  it('should navigate UP if possible', () => {
    jest.useFakeTimers().setSystemTime(new Date('2021-06-07').getTime())

    setup(new Date('2021-06-07'))

    // 1. focus the active cell
    userEvent.tab()

    // 2. go to the first row of the calendar
    userEvent.keyboard('{ArrowUp}')
    expect(screen.getByText('31/5')).toHaveFocus()

    // 3. press the up arrow again, should not change the active cell
    // because there are no more rows above it
    userEvent.keyboard('{ArrowUp}')
    expect(screen.getByText('31/5')).toHaveFocus()

    jest.useRealTimers()
  })

  it('should navigate DOWN if possible', () => {
    jest.useFakeTimers().setSystemTime(new Date('2021-06-24').getTime())

    setup(new Date('2021-06-24'))

    // 1. focus the active cell
    userEvent.tab()

    // 2. go to the last row of the calendar
    userEvent.keyboard('{ArrowDown}')
    expect(screen.getByText('1/7')).toHaveFocus()

    // 3. press the down arrow again, should not change the active cell
    // because there are no more rows under it
    userEvent.keyboard('{ArrowDown}')
    expect(screen.getByText('1/7')).toHaveFocus()

    jest.useRealTimers()
  })

  it('should focus today', () => {
    jest.useFakeTimers().setSystemTime(new Date('2021-07-05').getTime())

    const { mockSetSelectedCell, outerClickHandler } = setup(new Date('2021-07-05'))

    // 1. focus the active cell
    userEvent.tab()

    // 2. press the enter key
    userEvent.keyboard('{Enter}')

    expect(mockSetSelectedCell).toHaveBeenCalledWith(7)
    expect(outerClickHandler).not.toHaveBeenCalled()

    jest.useRealTimers()
  })

  it('should focus the first day of month when select date is in another month', () => {
    jest.useFakeTimers().setSystemTime(new Date('2021-07-05').getTime())

    const { mockSetSelectedCell, outerClickHandler } = setup(new Date('2021-06-11'))

    // 1. focus the active cell
    userEvent.tab()

    // 2. press the enter key
    userEvent.keyboard('{Enter}')

    expect(mockSetSelectedCell).toHaveBeenCalledWith(1)
    expect(outerClickHandler).not.toHaveBeenCalled()

    jest.useRealTimers()
  })
})

const setup = (selectedDate: Date) => {
  const mockSetSelectedCell = jest.fn()
  const outerClickHandler = jest.fn()

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
      <div ref={(x) => calendarRef(x!)} data-testid="calendar">
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

  render(<Calendar />)

  return { mockSetSelectedCell, outerClickHandler }
}
