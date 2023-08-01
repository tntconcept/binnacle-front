import { CellActivityButton } from './cell-activity-button'
import { ActivityMother } from '../../../../../../../../../test-utils/mothers/activity-mother'
import { useExecuteUseCaseOnMount } from '../../../../../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { UserSettingsMother } from '../../../../../../../../../test-utils/mothers/user-settings-mother'
import {
  render,
  screen,
  waitFor,
  fireEvent,
  userEvent
} from '../../../../../../../../../test-utils/render'

jest.mock('../../../../../../../../../shared/arch/hooks/use-execute-use-case-on-mount')

describe('CellActivityButton', () => {
  it('should show description', () => {
    jest.useFakeTimers().setSystemTime(new Date('2021-07-12T21:30:00').getTime())

    setup(false)

    expect(screen.getByRole('button')).toHaveTextContent('09:00 - 13:00 Minutes activity')
    expect(screen.getByRole('button').firstChild).toHaveAttribute(
      'aria-label',
      '09:00 - 13:00, Minutes activity'
    )

    jest.useRealTimers()
  })

  it('should show project name', () => {
    jest.useFakeTimers().setSystemTime(new Date('2021-07-12T21:30:00').getTime())

    setup(false, false, true)

    expect(screen.getByRole('button')).toHaveTextContent('09:00 - 13:00 Billable project')
    expect(screen.getByRole('button').firstChild).toHaveAttribute(
      'aria-label',
      '09:00 - 13:00, activity_form.billable, activity_form.project:Billable project'
    )

    jest.useRealTimers()
  })

  it('should open update activity form on click', () => {
    const { onClickSpy } = setup(false)

    fireEvent.click(screen.getByRole('button'))

    expect(onClickSpy).toHaveBeenCalled()
  })

  it('should show activity preview on hover', async () => {
    setup(false)

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('tabIndex', '-1')

    fireEvent.focus(screen.getByRole('button'))

    await waitFor(() => {
      expect(screen.queryByTestId('activity_tooltip')).not.toBeInTheDocument()
    })

    userEvent.hover(screen.getByRole('button'))

    await waitFor(() => {
      expect(screen.getByTestId('activity_tooltip')).toBeInTheDocument()
    })

    expect(screen.getByTestId('activity_tooltip')).toBeInTheDocument()
  })

  it('should show activity preview on focus', async () => {
    setup(true)

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('tabIndex', '0')

    fireEvent.focus(button)

    await waitFor(() => {
      expect(screen.getByTestId('activity_tooltip')).toBeInTheDocument()
    })
  })
})

const setup = (canFocus: boolean, showDescription = true, billable?: boolean) => {
  const activity = ActivityMother.activityWithRenderDays()
  activity.billable = billable ?? false
  const onClickSpy = jest.fn()

  ;(useExecuteUseCaseOnMount as jest.Mock).mockReturnValue({
    result: UserSettingsMother.userSettings({ showDescription })
  })

  render(<CellActivityButton activity={activity} canFocus={canFocus} onClick={onClickSpy} />)

  return { activity, onClickSpy }
}
