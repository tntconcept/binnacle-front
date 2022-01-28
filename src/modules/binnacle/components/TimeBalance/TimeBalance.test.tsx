import { render, screen, waitFor } from '@testing-library/react'
import { mock } from 'jest-mock-extended'
import { TimeBalance } from 'modules/binnacle/components/TimeBalance/TimeBalance'
import { TimeBalanceRepository } from 'modules/binnacle/data-access/repositories/time-balance-repository'
import { BinnacleState } from 'modules/binnacle/data-access/state/binnacle-state'
import { AppState } from 'shared/data-access/state/app-state'
import { SettingsState } from 'shared/data-access/state/settings-state'
import chrono from 'shared/utils/chrono'
import { userEvent } from 'test-utils/app-test-utils'
import { buildUser } from 'test-utils/generateTestMocks'
import { container } from 'tsyringe'

describe('TimeBalance', () => {
  const date = chrono('2021-01-01').getDate()

  beforeEach(() => {
    const binnacleState = container.resolve(BinnacleState)
    const appStore = container.resolve(AppState)
    appStore.loggedUser = buildUser({ hiringDate: date })

    binnacleState.selectedDate = date
    binnacleState.selectedTimeBalanceMode = 'by-month'
    binnacleState.timeBalance = {
      timeWorked: 90,
      timeToWork: 60,
      timeDifference: 30
    }
  })

  it('should show the time duration using the HUMAN format', async () => {
    setup()

    const monthName = chrono(date).format('MMMM')

    expect(await screen.findByText(monthName)).toBeInTheDocument()
    expect(screen.getByTestId('time_worked_value')).toHaveTextContent('1h 30m')
    expect(screen.getByTestId('time_to_work_value')).toHaveTextContent('1h')
    expect(screen.getByTestId('time_balance_value')).toHaveTextContent('+ 30m')
  })

  it('should show the time duration using the DECIMAL format', async () => {
    container.resolve(SettingsState).settings.useDecimalTimeFormat = true

    await setup()

    expect(screen.getByTestId('time_worked_value')).toHaveTextContent('1.5')
    expect(screen.getByTestId('time_to_work_value')).toHaveTextContent('1')
    expect(screen.getByTestId('time_balance_value')).toHaveTextContent('+0.5')
  })

  it('should hide the time difference block when the month is in the future', async () => {
    container.resolve(BinnacleState).selectedDate = chrono(chrono.now())
      .plus(2, 'month')
      .getDate()

    await setup()

    expect(screen.queryByTestId('time_balance_value')).not.toBeInTheDocument()
  })

  it('should display time balance by year', async () => {
    const timeBalanceRepository = mock<TimeBalanceRepository>()
    container.registerInstance(TimeBalanceRepository, timeBalanceRepository)
    timeBalanceRepository.getTimeBalance.mockResolvedValue({
      '2021-01': {
        timeWorked: 10,
        timeToWork: 10,
        timeDifference: 0
      },
      '2021-02': {
        timeWorked: 20,
        timeToWork: 25,
        timeDifference: -5
      }
    })

    setup()

    userEvent.selectOptions(screen.getByTestId('select'), 'by-year')

    const year = date.getFullYear().toString()

    await waitFor(() => {
      expect(screen.getByText(year)).toBeInTheDocument()
    })
  })
})

function setup() {
  render(<TimeBalance />)
}
