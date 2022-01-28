import { mock } from 'jest-mock-extended'
import { GetTimeBalanceByYearAction } from 'modules/binnacle/data-access/actions/get-time-balance-by-year-action'
import { TimeBalanceRepository } from 'modules/binnacle/data-access/repositories/time-balance-repository'
import { AppState } from 'shared/data-access/state/app-state'
import { BinnacleState } from 'modules/binnacle/data-access/state/binnacle-state'

describe('GetTimeBalanceByYearAction', () => {
  it('should get time balance by year calculating the dates from the binnacle state', async () => {
    const { getTimeBalanceByYearAction, timeBalanceRepository, binnacleState } = setup()
    timeBalanceRepository.getTimeBalance.mockResolvedValue({
      '2020-12-01': {
        timeWorked: 1,
        timeToWork: 1,
        timeDifference: 0
      },
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
    binnacleState.selectedDate = new Date('2021-07-01')

    await getTimeBalanceByYearAction.execute()

    const startDate = new Date('2020-12-31T23:00:00.000Z')
    const endDate = new Date('2021-07-31T21:59:59.999Z')
    expect(timeBalanceRepository.getTimeBalance).toHaveBeenCalledWith(startDate, endDate)
    expect(binnacleState.selectedTimeBalanceMode).toEqual('by-year')
    expect(binnacleState.timeBalance).toEqual({
      timeDifference: 0,
      timeToWork: 2,
      timeWorked: 2
    })
  })
  it('should get time balance by year since january', async () => {
    const { getTimeBalanceByYearAction, timeBalanceRepository, binnacleState } = setup()
    timeBalanceRepository.getTimeBalance.mockResolvedValue({
      '2020-12-01': {
        timeWorked: 1,
        timeToWork: 1,
        timeDifference: 0
      },
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

    const selectedMonth = new Date('2021-08-01')
    await getTimeBalanceByYearAction.execute(selectedMonth)

    const startDate = new Date('2020-12-31T23:00:00.000Z')
    const endDate = new Date('2021-08-31T21:59:59.999Z')
    expect(timeBalanceRepository.getTimeBalance).toHaveBeenCalledWith(startDate, endDate)
    expect(binnacleState.selectedTimeBalanceMode).toEqual('by-year')
    expect(binnacleState.timeBalance).toEqual({
      timeDifference: 0,
      timeToWork: 2,
      timeWorked: 2
    })
  })
  it('should get time balance by year since user hiring date', async () => {
    const { getTimeBalanceByYearAction, timeBalanceRepository, binnacleState, appState } = setup()
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

    appState.loggedUser = { hiringDate: new Date('2021-07-01') } as any

    const selectedMonth = new Date('2021-10-01')
    await getTimeBalanceByYearAction.execute(selectedMonth)

    const startDate = new Date('2021-07-01')
    const endDate = new Date('2021-10-31T22:59:59.999Z')
    expect(timeBalanceRepository.getTimeBalance).toHaveBeenCalledWith(startDate, endDate)
    expect(binnacleState.selectedTimeBalanceMode).toEqual('by-year')
    expect(binnacleState.timeBalance).toEqual({
      timeDifference: 0,
      timeToWork: 2,
      timeWorked: 2
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
    timeBalanceRepository,
    appState,
    binnacleState,
    getTimeBalanceByYearAction: new GetTimeBalanceByYearAction(
      timeBalanceRepository,
      appState,
      binnacleState
    )
  }
}
