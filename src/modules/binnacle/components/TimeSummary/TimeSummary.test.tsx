import { render, RenderResult, screen, waitFor } from '@testing-library/react'
import { container } from 'tsyringe'
import { SettingsState } from '../../../../shared/data-access/state/settings-state'
import { userEvent } from '../../../../test-utils/app-test-utils'
import { BinnacleState } from '../../data-access/state/binnacle-state'
import { TimeSummary } from './TimeSummary'

const YearBalanceMock = () => {
  return <div></div>
}
jest.mock('../YearBalance/YearBalanceButton', () => () => YearBalanceMock)

describe('TimeSummary', () => {
  const now = new Date()
  const date = new Date(now.getFullYear() + 1, 0, 1)

  const getBinnacleState = () => container.resolve(BinnacleState)
  const setMonthlyBalance = (props: { workedHours: number; targetHours: number }) => {
    const state = getBinnacleState()
    const { workedHours, targetHours } = props

    const generateRandomNumber = () => Math.floor(Math.random() * 1000)

    state.timeSummary = {
      year: {
        current: {
          worked: generateRandomNumber(),
          target: generateRandomNumber(),
          balance: generateRandomNumber(),
          notRequestedVacations: generateRandomNumber()
        }
      },
      months: [
        {
          workable: generateRandomNumber(),
          worked: workedHours,
          recommended: targetHours,
          balance: workedHours - targetHours,
          vacation: 0,
          roles: []
        }
      ]
    }
  }

  const setAnnualBalance = (props: {
    workedHours: number
    targetHours: number
    vacationNotRequested: number
  }) => {
    const state = getBinnacleState()
    const { workedHours, targetHours, vacationNotRequested } = props

    state.timeSummary = {
      year: {
        current: {
          worked: workedHours,
          target: targetHours,
          balance: (workedHours ?? 0) - ((targetHours ?? 0) + vacationNotRequested),
          notRequestedVacations: vacationNotRequested
        }
      },
      months: [{ workable: 10, worked: 2, recommended: 3, balance: -1, vacation: 0, roles: [] }]
    }
  }

  beforeEach(() => {
    const binnacleState = container.resolve(BinnacleState)
    const settingState = container.resolve(SettingsState)
    settingState.settings.useDecimalTimeFormat = false
    binnacleState.selectedDate = date
    binnacleState.timeSummary = {
      year: {
        current: {
          worked: 0,
          target: 1565,
          balance: 10,
          notRequestedVacations: 8
        }
      },
      months: [
        {
          workable: 10,
          worked: 1.5,
          recommended: 1,
          balance: 0.5,
          vacation: 0,
          roles: []
        },
        {
          workable: 10,
          worked: 0,
          recommended: 0,
          balance: 0,
          vacation: 0,
          roles: []
        },
        {
          workable: 10,
          worked: 0,
          recommended: 0,
          balance: 0,
          vacation: 0,
          roles: []
        }
      ]
    }

    screen.debug()
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

    const monthlyBalance = screen.getByText('+30min')
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

    const monthlyBalance = screen.getByText('-30min')
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

    const monthlyBalance = screen.getByText('-69h 30min')
    expect(monthlyBalance).toBeInTheDocument()
  }

  describe('monthly balance', () => {
    const assertMonthlySelected = () => {
      const option = screen.getByRole('option', { selected: true }) as HTMLOptionElement
      expect(option.value).toBe('by-month')
    }

    beforeEach(() => {
      const state = getBinnacleState()
      state.selectedTimeSummaryMode = 'by-month'
    })

    it('should show a positive balance', () => {
      assertPositiveBalance(setMonthlyBalance)
      assertMonthlySelected()
    })

    it('should show a negative balance', () => {
      assertNegativeBalance(setMonthlyBalance)
      assertMonthlySelected()
    })

    it('should show a zero balance', () => {
      assertZeroBalance(setMonthlyBalance)
      assertMonthlySelected()
    })

    it('should show hours and minutes balance', () => {
      assertShowHoursAndMinutesBalance(setMonthlyBalance)
      assertMonthlySelected()
    })
  })

  const assertPositiveAnnualBalance = (
    setBalance: (props: {
      workedHours: number
      targetHours: number
      vacationNotRequested: number
    }) => void
  ) => {
    setBalance({
      workedHours: 9.5,
      targetHours: 1,
      vacationNotRequested: 8
    })

    setup()

    const monthlyBalance = screen.getByText('+30min')
    expect(monthlyBalance).toBeInTheDocument()
  }

  const assertNegativeAnnualBalance = (
    setBalance: (props: {
      workedHours: number
      targetHours: number
      vacationNotRequested: number
    }) => void
  ) => {
    setBalance({
      workedHours: 2.5,
      targetHours: 1,
      vacationNotRequested: 16
    })
    setup()

    const monthlyBalance = screen.getByText('-14h 30min')
    expect(monthlyBalance).toBeInTheDocument()
  }

  const assertZeroAnnualBalance = (
    setBalance: (props: {
      workedHours: number
      targetHours: number
      vacationNotRequested: number
    }) => void
  ) => {
    setBalance({
      workedHours: 1,
      targetHours: 1,
      vacationNotRequested: 0
    })
    setup()

    const zeroBalance = screen.getByText('0h')
    expect(zeroBalance).toBeInTheDocument()
  }

  const assertShowHoursAndMinutesAnnualBalance = (
    setBalance: (props: {
      workedHours: number
      targetHours: number
      vacationNotRequested: number
    }) => void
  ) => {
    setBalance({
      workedHours: 10.5,
      targetHours: 80,
      vacationNotRequested: 40
    })
    setup()

    const monthlyBalance = screen.getByText('-109h 30min')
    expect(monthlyBalance).toBeInTheDocument()
  }

  describe('annual balance', () => {
    const assertAnnualSelected = (): void => {
      const option = screen.getByRole('option', { selected: true }) as HTMLOptionElement
      expect(option.value).toBe('by-year')
    }

    beforeEach(() => {
      const binnacleState = getBinnacleState()
      binnacleState.selectedTimeSummaryMode = 'by-year'
    })

    it('should show a positive balance', () => {
      assertPositiveAnnualBalance(setAnnualBalance)
      assertAnnualSelected()
    })

    it('should show a negative balance', () => {
      assertNegativeAnnualBalance(setAnnualBalance)
      assertAnnualSelected()
    })

    it('should show a zero balance', () => {
      assertZeroAnnualBalance(setAnnualBalance)
      assertAnnualSelected()
    })

    it('should show hours and minutes balance', () => {
      assertShowHoursAndMinutesAnnualBalance(setAnnualBalance)
      assertAnnualSelected()
    })
  })
})

function setup(): RenderResult {
  return render(<TimeSummary />)
}
