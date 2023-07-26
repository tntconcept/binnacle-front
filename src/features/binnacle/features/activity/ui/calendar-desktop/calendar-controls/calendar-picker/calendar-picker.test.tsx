import { render, screen, userEvent } from '../../../../../../../../test-utils/render'
import { CalendarPicker } from './calendar-picker'
import { useExecuteUseCaseOnMount } from '../../../../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { useCalendarContext } from '../../../contexts/calendar-context'
import { chrono } from '../../../../../../../../shared/utils/chrono'
import { waitFor, within } from '@testing-library/react'

jest.mock('../../../../../../../../shared/arch/hooks/use-execute-use-case-on-mount', () => ({
  useExecuteUseCaseOnMount: jest.fn()
}))

jest.mock('../../../contexts/calendar-context', () => ({
  useCalendarContext: jest.fn()
}))

describe('CalendarPicker', () => {
  it('should display selected date', () => {
    setup({ isLoading: true, selectedDate: chrono(new Date('2023-05-22')).getDate() })

    expect(screen.getByTestId('selected_date')).toHaveTextContent('May2023')
  })

  it('should open and select month successfully', async () => {
    setup({
      isLoading: false,
      selectedDate: new Date('2021-08-04')
    })

    userEvent.click(screen.getByTestId('selected_date'))

    await waitFor(() => {
      expect(screen.getByText('calendar_popover.select_year_month_title')).toBeInTheDocument()
    })

    const inPopoverContent = within(
      screen.getByText('calendar_popover.select_year_month_title').parentElement!
    )

    // show years between hiring and current year inclusive
    Array.of('2020', '2021').forEach((year) => {
      expect(inPopoverContent.getByText(year)).toBeInTheDocument()
    })

    userEvent.click(inPopoverContent.getByText('2021'))

    // show months between january and december inclusive
    // prettier-ignore
    Array.of('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec').forEach((month) => {
      expect(inPopoverContent.getByText(month)).toBeInTheDocument()
    })

    userEvent.click(inPopoverContent.getByText('Jan'))

    await waitFor(() => {
      expect(screen.queryByText('calendar_popover.select_year_month_title')).not.toBeVisible()
    })

    // show again years list
    userEvent.click(screen.getByTestId('selected_date'))

    Array.of('2020', '2021').forEach((year) => {
      expect(inPopoverContent.getByText(year)).toBeInTheDocument()
    })
  })

  it('should disable months before hiring date', async () => {
    setup({
      isLoading: false,
      selectedDate: new Date('2021-08-04')
    })

    userEvent.click(screen.getByTestId('selected_date'))

    await waitFor(() => {
      expect(screen.getByText('calendar_popover.select_year_month_title')).toBeInTheDocument()
    })

    const inPopoverContent = within(
      screen.getByText('calendar_popover.select_year_month_title').parentElement!
    )

    userEvent.click(inPopoverContent.getByText('2020'))

    const disabledMonths = ['Jan', 'Feb']
    const enabledMonths = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    disabledMonths.forEach((month) => {
      expect(inPopoverContent.getByText(month)).toBeDisabled()
    })

    enabledMonths.forEach((month) => {
      expect(inPopoverContent.getByText(month)).not.toBeDisabled()
    })
  })

  it('should disable months after current month', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-05-22').getTime())
    setup({
      isLoading: false,
      selectedDate: new Date()
    })

    userEvent.click(screen.getByTestId('selected_date'))

    await waitFor(() => {
      expect(screen.getByText('calendar_popover.select_year_month_title')).toBeInTheDocument()
    })

    const inPopoverContent = within(
      screen.getByText('calendar_popover.select_year_month_title').parentElement!
    )

    userEvent.click(inPopoverContent.getByText('2023'))

    const enabledMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May']
    const disabledMonths = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    enabledMonths.forEach((month) => {
      expect(inPopoverContent.getByText(month)).not.toBeDisabled()
    })

    disabledMonths.forEach((month) => {
      expect(inPopoverContent.getByText(month)).toBeDisabled()
    })

    jest.useRealTimers()
  })
})

const setup = ({ isLoading, selectedDate }: any) => {
  ;(useExecuteUseCaseOnMount as jest.Mock).mockReturnValue({
    isLoading,
    result: {
      hiringDate: new Date('2020-03-01')
    }
  })
  ;(useCalendarContext as jest.Mock).mockReturnValue({
    selectedDate
  })

  render(<CalendarPicker />)
}
