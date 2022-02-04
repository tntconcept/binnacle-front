import chrono from '../../../../shared/utils/chrono'
import { container } from 'tsyringe'
import { BinnacleState } from '../../data-access/state/binnacle-state'
import { WorkingBalance } from './WorkingBalance'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '../../../../test-utils/app-test-utils'
import { SettingsState } from '../../../../shared/data-access/state/settings-state'

describe('WorkingBalance', () => {
  const date = chrono('2021-01-01').getDate()

  beforeEach(() => {
    const binnacleState = container.resolve(BinnacleState)
    binnacleState.selectedDate = date
    binnacleState.workingBalance = {
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
    expect(screen.getByTestId('time_to_work_value')).toHaveTextContent('1h')
  })

  it('should show the time duration using the HUMAN format by-year', async () => {
    await setup()
    userEvent.selectOptions(screen.getByTestId('select'), 'by-year')

    await waitFor(() => {
      expect(screen.getByTestId('time_worked_value')).toHaveTextContent('0h')
      expect(screen.getByTestId('time_to_work_value')).toHaveTextContent('1565h')
    })
  })

  it('should show the time duration using the DECIMAL format by-month', () => {
    container.resolve(SettingsState).settings.useDecimalTimeFormat = true
    setup()

    expect(screen.getByTestId('time_worked_value')).toHaveTextContent('1.5')
    expect(screen.getByTestId('time_to_work_value')).toHaveTextContent('1')
  })

  it('should show the time duration using the DECIMAL format by-year', async () => {
    container.resolve(SettingsState).settings.useDecimalTimeFormat = true
    await setup()
    userEvent.selectOptions(screen.getByTestId('select'), 'by-year')

    await waitFor(() => {
      expect(screen.getByTestId('time_worked_value')).toHaveTextContent('0')
      expect(screen.getByTestId('time_to_work_value')).toHaveTextContent('1565')
    })
  })

})

function setup() {
  render(<WorkingBalance />)
}
