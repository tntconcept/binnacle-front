import { render, screen, userEvent } from 'test-utils/app-test-utils'
import { CalendarPicker } from 'modules/binnacle/page/BinnacleDesktop/CalendarControls/CalendarPicker/CalendarPicker'
import { container } from 'tsyringe'
import { AppState } from 'shared/data-access/state/app-state'
import { buildUser } from 'test-utils/generateTestMocks'
import { waitFor, within } from '@testing-library/react'
import { GetCalendarDataAction } from 'modules/binnacle/data-access/actions/get-calendar-data-action'
import { mock } from 'jest-mock-extended'

describe('CalendarPicker', () => {
  it('should display selected date', () => {
    setup({ selectedDate: new Date('2021-08-04'), hiringDate: new Date('2020-06-01') })

    expect(screen.getByTestId('selected_date')).toHaveTextContent('August2021')
  })

  it('should open and select month successfully', async () => {
    const getCalendarDataAction = mock<GetCalendarDataAction>()
    container.registerInstance(GetCalendarDataAction, getCalendarDataAction)

    setup({ selectedDate: new Date('2021-08-04'), hiringDate: new Date('2020-06-01') })

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

    expect(getCalendarDataAction.execute).toHaveBeenCalledWith(new Date('2020-12-31T23:00:00.000Z'))

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
    setup({ selectedDate: new Date('2021-08-04'), hiringDate: new Date('2020-03-01') })

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
    jest.useFakeTimers('modern').setSystemTime(new Date('2021-09-04').getTime())
    setup({ selectedDate: new Date('2021-09-04'), hiringDate: new Date('2020-03-01') })

    userEvent.click(screen.getByTestId('selected_date'))

    await waitFor(() => {
      expect(screen.getByText('calendar_popover.select_year_month_title')).toBeInTheDocument()
    })

    const inPopoverContent = within(
      screen.getByText('calendar_popover.select_year_month_title').parentElement!
    )

    userEvent.click(inPopoverContent.getByText('2021'))

    const enabledMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
    const disabledMonths = ['Oct', 'Nov', 'Dec']

    enabledMonths.forEach((month) => {
      expect(inPopoverContent.getByText(month)).not.toBeDisabled()
    })

    disabledMonths.forEach((month) => {
      expect(inPopoverContent.getByText(month)).toBeDisabled()
    })

    jest.useRealTimers()
  })
})

const setup = (params: { selectedDate: Date; hiringDate: Date }) => {
  const appState = container.resolve(AppState)
  appState.loggedUser = buildUser({ hiringDate: params.hiringDate })

  render(<CalendarPicker selectedDate={params.selectedDate} />)
}
