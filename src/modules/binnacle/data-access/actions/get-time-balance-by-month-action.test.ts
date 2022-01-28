import { mock } from 'jest-mock-extended'
import { TimeBalanceRepository } from 'modules/binnacle/data-access/repositories/time-balance-repository'
import { AppState } from 'shared/data-access/state/app-state'
import { BinnacleState } from 'modules/binnacle/data-access/state/binnacle-state'
import { GetTimeBalanceByMonthAction } from 'modules/binnacle/data-access/actions/get-time-balance-by-month-action'

describe('GetTimeBalanceByMonthAction', () => {
  it('should get time balance by month calculating the dates from the binnacle state', async () => {
    const { getTimeBalanceByMonth, timeBalanceRepository, binnacleState } = setup()
    timeBalanceRepository.getTimeBalance.mockResolvedValue({
      '2020-06-01': {
        timeWorked: 1,
        timeToWork: 1,
        timeDifference: 0
      },
      '2021-07-01': {
        timeWorked: 2,
        timeToWork: 1,
        timeDifference: 1
      }
    })
    binnacleState.selectedDate = new Date('2021-07-01')

    await getTimeBalanceByMonth.execute()

    const startDate = new Date('2021-06-30T22:00:00.000Z')
    const endDate = new Date('2021-07-31T21:59:59.999Z')
    expect(timeBalanceRepository.getTimeBalance).toHaveBeenCalledWith(startDate, endDate)
    expect(binnacleState.selectedTimeBalanceMode).toEqual('by-month')
    expect(binnacleState.timeBalance).toEqual({
      timeWorked: 2,
      timeToWork: 1,
      timeDifference: 1
    })
  })
  it('should get time balance by month since start of month', async () => {
    const { getTimeBalanceByMonth, timeBalanceRepository, binnacleState } = setup()
    timeBalanceRepository.getTimeBalance.mockResolvedValue({
      '2021-07-01': {
        timeWorked: 2,
        timeToWork: 1,
        timeDifference: 1
      }
    })

    const selectedMonth = new Date('2021-07-01')
    await getTimeBalanceByMonth.execute(selectedMonth)

    const startDate = new Date('2021-06-30T22:00:00.000Z')
    const endDate = new Date('2021-07-31T21:59:59.999Z')
    expect(timeBalanceRepository.getTimeBalance).toHaveBeenCalledWith(startDate, endDate)
    expect(binnacleState.selectedTimeBalanceMode).toEqual('by-month')
    expect(binnacleState.timeBalance).toEqual({
      timeWorked: 2,
      timeToWork: 1,
      timeDifference: 1
    })
  })
  it('should get time balance by month since user hiring date', async () => {
    const { getTimeBalanceByMonth, timeBalanceRepository, binnacleState, appState } = setup()
    timeBalanceRepository.getTimeBalance.mockResolvedValue({
      '2021-07-01': {
        timeWorked: 2,
        timeToWork: 1,
        timeDifference: 1
      },
      '2021-08-01': {
        timeWorked: 0,
        timeToWork: 1,
        timeDifference: -1
      }
    })

    appState.loggedUser = { hiringDate: new Date('2021-07-12') } as any

    const selectedMonth = new Date('2021-07-01')
    await getTimeBalanceByMonth.execute(selectedMonth)

    const startDate = new Date('2021-07-12T00:00:00.000Z')
    const endDate = new Date('2021-07-31T21:59:59.999Z')
    expect(timeBalanceRepository.getTimeBalance).toHaveBeenCalledWith(startDate, endDate)
    expect(binnacleState.selectedTimeBalanceMode).toEqual('by-month')
    expect(binnacleState.timeBalance).toEqual({
      timeWorked: 2,
      timeToWork: 1,
      timeDifference: 1
    })
  })
})

function setup() {
  const timeBalanceRepository = mock<TimeBalanceRepository>()

  const appState = new AppState()
  appState.loggedUser = { hiringDate: new Date('2018-07-01') } as any

  const binnacleState = new BinnacleState()
  binnacleState.selectedTimeBalanceMode = 'by-month'

  return {
    getTimeBalanceByMonth: new GetTimeBalanceByMonthAction(
      timeBalanceRepository,
      appState,
      binnacleState
    ),
    timeBalanceRepository,
    appState,
    binnacleState
  }
}
