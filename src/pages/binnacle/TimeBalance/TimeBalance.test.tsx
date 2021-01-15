import React, { Suspense } from 'react'
import { TimeBalance } from 'pages/binnacle/TimeBalance/TimeBalance'
import { render, waitFor } from '@testing-library/react'
import { BinnacleResourcesContext } from 'core/providers/BinnacleResourcesProvider'
import { ITimeBalance } from 'core/api/interfaces'
import userEvent from '@testing-library/user-event'
import { useSettings as useSettingsMock } from 'pages/settings/Settings.utils'
import fetchLoggedUserMock from 'core/api/users'
import chrono from 'core/services/Chrono'
import { buildUser } from 'test-utils/generateTestMocks'

jest.mock('pages/settings/Settings.utils')
jest.mock('core/api/users')

describe('TimeBalance', () => {
  type ProvidersMocks = {
    timeBalance?: ITimeBalance
    selectedMonth?: Date
    timeBalanceMode?: 'by_month' | 'by_year'
    fetchTimeResource?: any
    useDecimalTimeFormat?: boolean
  }

  const defaultTimeBalance = {
    timeWorked: 0,
    timeToWork: 0,
    timeDifference: 0
  }

  function renderTimeBalance({
    timeBalance = defaultTimeBalance,
    selectedMonth = chrono.now(),
    timeBalanceMode = 'by_month',
    fetchTimeResource = jest.fn(),
    useDecimalTimeFormat = false
  }: ProvidersMocks) {
    // @ts-ignore
    fetchLoggedUserMock.mockResolvedValue(buildUser())

    const Providers: React.FC = (props) => {
      return (
        <Suspense fallback={<p>Loading time balance...</p>}>
          <BinnacleResourcesContext.Provider
            value={{
              // @ts-ignore
              timeReader: jest.fn(() => timeBalance),
              fetchTimeResource,
              timeBalanceMode,
              selectedMonth
            }}
          >
            {props.children}
          </BinnacleResourcesContext.Provider>
        </Suspense>
      )
    }

    // @ts-ignore
    useSettingsMock.mockReturnValue({
      useDecimalTimeFormat: useDecimalTimeFormat
    })

    return render(<TimeBalance />, { wrapper: Providers })
  }

  it('should show the time duration using the HUMAN format', async () => {
    const date = chrono.now()
    const { getByTestId, findByText } = renderTimeBalance({
      timeBalance: {
        timeWorked: 90,
        timeToWork: 60,
        timeDifference: 30
      },
      selectedMonth: date,
      useDecimalTimeFormat: false
    })

    expect(await findByText(chrono(date).format('MMMM'))).toBeInTheDocument()
    expect(getByTestId('time_worked_value')).toHaveTextContent('1h 30m')
    expect(getByTestId('time_to_work_value')).toHaveTextContent('1h')
    expect(getByTestId('time_balance_value')).toHaveTextContent('+ 30m')
  })

  it('should show the time duration using the DECIMAL format', function() {
    const { getByTestId } = renderTimeBalance({
      timeBalance: {
        timeWorked: 90,
        timeToWork: 60,
        timeDifference: 30
      },
      selectedMonth: chrono.now(),
      useDecimalTimeFormat: true
    })

    expect(getByTestId('time_worked_value')).toHaveTextContent('1.5')
    expect(getByTestId('time_to_work_value')).toHaveTextContent('1')
    expect(getByTestId('time_balance_value')).toHaveTextContent('+0.5')
  })

  it('should hide the time difference block when the month is in the future', function() {
    const futureMonth = chrono(chrono.now())
      .plus(2, 'month')
      .getDate()
    const { queryByTestId } = renderTimeBalance({
      selectedMonth: futureMonth
    })

    expect(queryByTestId('time_balance_value')).not.toBeInTheDocument()
  })

  it('should change the time balance mode', async () => {
    const fetchTimeResourceMock = jest.fn().mockResolvedValue(null)
    const { getByTestId } = renderTimeBalance({
      timeBalanceMode: 'by_month',
      fetchTimeResource: fetchTimeResourceMock
    })

    userEvent.selectOptions(getByTestId('select'), 'by_year')

    expect(fetchTimeResourceMock).toHaveBeenCalledWith('by_year')

    userEvent.selectOptions(getByTestId('select'), 'by_month')

    expect(fetchTimeResourceMock).toHaveBeenCalledWith('by_month')
  })

  it('should show "business hours" instead of the month name when is calculated by year', async () => {
    const { getByText } = renderTimeBalance({
      timeBalanceMode: 'by_year'
    })

    await waitFor(() => {
      expect(
        getByText(
          chrono
            .now()
            .getFullYear()
            .toString()
        )
      ).toBeInTheDocument()
    })
  })
})
