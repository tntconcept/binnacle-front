import React from 'react'
import { TimeBalance } from 'pages/binnacle/TimeBalance/TimeBalance'
import { render } from '@testing-library/react'
import { BinnacleResourcesContext } from 'core/features/BinnacleResourcesProvider'
import { ITimeBalance } from 'api/interfaces/ITimeBalance'
import DateTime from 'services/DateTime'
import userEvent from '@testing-library/user-event'
import { useSettings as useSettingsMock } from 'pages/settings/Settings.utils'

jest.mock('pages/settings/Settings.utils')

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
    selectedMonth = DateTime.now(),
    timeBalanceMode = 'by_month',
    fetchTimeResource = jest.fn(),
    useDecimalTimeFormat = false
  }: ProvidersMocks) {
    const Providers: React.FC = (props) => {
      return (
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
      )
    }

    // @ts-ignore
    useSettingsMock.mockReturnValue({
      useDecimalTimeFormat: useDecimalTimeFormat
    })

    return render(<TimeBalance />, { wrapper: Providers })
  }

  it('should show the time duration using the HUMAN format', function() {
    const Date = DateTime.now()
    const { getByTestId, getByText } = renderTimeBalance({
      timeBalance: {
        timeWorked: 90,
        timeToWork: 60,
        timeDifference: 30
      },
      selectedMonth: Date,
      useDecimalTimeFormat: false
    })

    expect(getByText(DateTime.format(Date, 'MMMM'))).toBeInTheDocument()
    expect(getByTestId('time_worked_value')).toHaveTextContent('1h 30m')
    expect(getByTestId('time_to_work_value')).toHaveTextContent('1h')
    expect(getByTestId('time_balance_value')).toHaveTextContent('+ 30m')
    expect(getByTestId('time_balance_value')).toHaveStyle('color: green')
  })

  it('should show the time duration using the DECIMAL format', function() {
    const { getByTestId } = renderTimeBalance({
      timeBalance: {
        timeWorked: 90,
        timeToWork: 60,
        timeDifference: 30
      },
      selectedMonth: DateTime.now(),
      useDecimalTimeFormat: true
    })

    expect(getByTestId('time_worked_value')).toHaveTextContent('1.5')
    expect(getByTestId('time_to_work_value')).toHaveTextContent('1')
    expect(getByTestId('time_balance_value')).toHaveTextContent('+0.5')
  })

  it('should hide the time difference block when the month is in the future', function() {
    const futureMonth = DateTime.addMonths(DateTime.now(), 2)
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

  it('should show "business hours" instead of the month name when is calculated by year', function() {
    const { getByText } = renderTimeBalance({
      timeBalanceMode: 'by_year'
    })

    expect(getByText('2020')).toBeInTheDocument()
  })
})
