import chrono from '../../../../shared/utils/chrono'
import { container } from 'tsyringe'
import { BinnacleState } from '../../data-access/state/binnacle-state'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '../../../../test-utils/app-test-utils'
import { SettingsState } from '../../../../shared/data-access/state/settings-state'
import { WorkingTime } from './WorkingTime'

describe('WorkingBalance', () => {
  const date = chrono('2021-01-01').getDate()

  const getBinnacleState = () => container.resolve(BinnacleState)
  const setMonthlyBalance = (props: { workedHours: number; targetHours: number }) => {
    const state = getBinnacleState()
    const { workedHours, targetHours } = props

    state.workingTime = {
      annualBalance: { worked: workedHours, targetWork: targetHours },
      monthlyBalances: {
        '1': { worked: workedHours, recommendedWork: targetHours }
      }
    }
  }

  const setAnnualBalance = (props: { workedHours: number; targetHours: number }) => {
    const state = getBinnacleState()
    const { workedHours, targetHours } = props

    state.workingTime = {
      annualBalance: { worked: workedHours, targetWork: targetHours },
      monthlyBalances: {}
    }
  }

  beforeEach(() => {
    const binnacleState = container.resolve(BinnacleState)
    const settingState = container.resolve(SettingsState)
    settingState.settings.useDecimalTimeFormat = false
    binnacleState.selectedDate = date
    binnacleState.workingTime = {
      annualBalance: {
        worked: 0,
        targetWork: 1565
      },
      monthlyBalances: {
        '1': {
          worked: 1.5,
          recommendedWork: 1
        },
        '2': {
          worked: 0,
          recommendedWork: 0
        },
        '3': {
          worked: 0,
          recommendedWork: 0
        }
      }
    }
  })

  it('should show the time duration using the HUMAN format by-month', () => {
    setup()

    expect(screen.getByTestId('time_worked_value')).toHaveTextContent('1h 30m')
    expect(screen.getByTestId('time_tracking_hours')).toHaveTextContent('1h')
  })

  it('should show the time duration using the HUMAN format by-year', async () => {
    await setup()
    userEvent.selectOptions(screen.getByTestId('select'), 'by-year')

    await waitFor(() => {
      expect(screen.getByTestId('time_worked_value')).toHaveTextContent('0h')
      expect(screen.getByTestId('time_tracking_hours')).toHaveTextContent('1565h')
    })
  })

  it('should show the time duration using the DECIMAL format by-month', () => {
    container.resolve(SettingsState).settings.useDecimalTimeFormat = true
    setup()

    expect(screen.getByTestId('time_worked_value')).toHaveTextContent('1.5')
    expect(screen.getByTestId('time_tracking_hours')).toHaveTextContent('1')
  })

  it('should show the time duration using the DECIMAL format by-year', async () => {
    container.resolve(SettingsState).settings.useDecimalTimeFormat = true
    await setup()
    userEvent.selectOptions(screen.getByTestId('select'), 'by-year')

    await waitFor(() => {
      expect(screen.getByTestId('time_worked_value')).toHaveTextContent('0')
      expect(screen.getByTestId('time_tracking_hours')).toHaveTextContent('1565')
    })
  })

  const assertPositiveBalance = (
    setBalance: (props: { workedHours: number; targetHours: number }) => void
  ) => {
    setBalance({
      workedHours: 1.5,
      targetHours: 1
    })

    setup()

    const plusSign = screen.getByText('+')
    const monthlyBalance = screen.getByText('30min')
    expect(plusSign).toBeInTheDocument()
    expect(monthlyBalance).toBeInTheDocument()
  }

  const assertNegativeBalance = (
    setBalance: (props: { workedHours: number; targetHours: number }) => void
  ) => {
    setBalance({
      workedHours: 1,
      targetHours: 1.5
    })

    setup()

    const minusSign = screen.getByText('-')
    const monthlyBalance = screen.getByText('30min')
    expect(minusSign).toBeInTheDocument()
    expect(monthlyBalance).toBeInTheDocument()
  }

  const assertZeroBalance = (
    setBalance: (props: { workedHours: number; targetHours: number }) => void
  ) => {
    setBalance({
      workedHours: 1,
      targetHours: 1
    })

    setup()

    const zeroBalance = screen.getByText('0h')
    expect(zeroBalance).toBeInTheDocument()
  }

  const assertShowHoursAndMinutesBalance = (
    setBalance: (props: { workedHours: number; targetHours: number }) => void
  ) => {
    setBalance({
      workedHours: 10.5,
      targetHours: 80
    })

    setup()

    const monthlyBalance = screen.getByText('69h 30min')
    expect(monthlyBalance).toBeInTheDocument()
  }

  describe('monthly balance', () => {
    it('should show a positive balance', () => {
      assertPositiveBalance(setMonthlyBalance)
    })

    it('should show a negative balance', () => {
      assertNegativeBalance(setMonthlyBalance)
    })

    it('should show a zero balance', () => {
      assertZeroBalance(setMonthlyBalance)
    })

    it('should show hours and minutes balance', () => {
      assertShowHoursAndMinutesBalance(setMonthlyBalance)
    })
  })

  describe('annual balance', () => {
    beforeEach(() => {
      const binnacleState = getBinnacleState()
      binnacleState.selectedWorkingTimeMode = 'by-year'
    })

    it('should show a positive balance', () => {
      assertPositiveBalance(setAnnualBalance)
    })

    it('should show a negative balance', () => {
      assertNegativeBalance(setAnnualBalance)
    })

    it('should show a zero balance', () => {
      assertZeroBalance(setAnnualBalance)
    })

    it('should show hours and minutes balance', () => {
      assertShowHoursAndMinutesBalance(setAnnualBalance)
    })
  })
})

function setup() {
  render(<WorkingTime />)
}
