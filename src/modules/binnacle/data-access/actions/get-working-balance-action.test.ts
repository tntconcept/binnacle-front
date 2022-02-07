import { mock } from 'jest-mock-extended'
import { BinnacleState } from '../state/binnacle-state'
import { WorkingBalanceRepository } from '../repositories/working-balance-repository'
import { GetWorkingBalanceAction } from './get-working-balance-action'

beforeEach(() => {
  jest.useFakeTimers('modern').setSystemTime(new Date('2022-02-01').getTime())
})

describe('GetWorkingBalanceAction', () => {
  it('should get working balance calculating the date from the binnacle state ', async () => {
    const { getWorkingBalanceAction, workingBalanceRepository, binnacleState } = setup()
    workingBalanceRepository.getWorkingBalance.mockResolvedValue({
      annualBalance: {
        worked: 0,
        targetWork: 0
      },
      monthlyBalances: {
        '0': {
          worked: 0,
          recommendedWork: 0
        },
        '1': {
          worked: 0,
          recommendedWork: 0
        },
        '2': {
          worked: 0,
          recommendedWork: 0
        }
      }
    })
    binnacleState.selectedDate = new Date('2022-01-01')
    const actualDate = new Date('2022-02-01')

    await getWorkingBalanceAction.execute()

    expect(workingBalanceRepository.getWorkingBalance).toHaveBeenCalledWith(actualDate)
    expect(binnacleState.workingBalance).toEqual({
      annualBalance: {
        worked: 0,
        targetWork: 0
      },
      monthlyBalances: {
        '0': {
          worked: 0,
          recommendedWork: 0
        },
        '1': {
          worked: 0,
          recommendedWork: 0
        },
        '2': {
          worked: 0,
          recommendedWork: 0
        }
      }
    })
  })

  it('should get working balance calculating the date from the selected month ', async () => {
    const { getWorkingBalanceAction, workingBalanceRepository, binnacleState } = setup()
    workingBalanceRepository.getWorkingBalance.mockResolvedValue({
      annualBalance: {
        worked: 0,
        targetWork: 0
      },
      monthlyBalances: {
        '0': {
          worked: 0,
          recommendedWork: 0
        },
        '1': {
          worked: 0,
          recommendedWork: 0
        },
        '2': {
          worked: 0,
          recommendedWork: 0
        }
      }
    })
    binnacleState.selectedDate = new Date('2022-01-01')
    const date = new Date('2021-12-01T00:00:00.000Z')
    const selectedMonth = new Date('2021-12-01')
    const yearChanged = selectedMonth.getFullYear() !== binnacleState.selectedDate.getFullYear()

    await getWorkingBalanceAction.execute(selectedMonth, yearChanged)

    expect(workingBalanceRepository.getWorkingBalance).toHaveBeenCalledWith(date)
    expect(binnacleState.workingBalance).toEqual({
      annualBalance: {
        worked: 0,
        targetWork: 0
      },
      monthlyBalances: {
        '0': {
          worked: 0,
          recommendedWork: 0
        },
        '1': {
          worked: 0,
          recommendedWork: 0
        },
        '2': {
          worked: 0,
          recommendedWork: 0
        }
      }
    })
  })

  it('should make the request from january of the year selected when the year date is major than the actual date', async () => {
    const { getWorkingBalanceAction, workingBalanceRepository } = setup()
    const selectedMonth = new Date('2023-02-01')
    const date = new Date('2023-01-01T00:00:00.000Z')

    await getWorkingBalanceAction.execute(selectedMonth, true)

    expect(workingBalanceRepository.getWorkingBalance).toHaveBeenCalledWith(date)
  })

  it('should make the request from december of the year selected when the year date is minor than the actual date', async () => {
    const { getWorkingBalanceAction, workingBalanceRepository } = setup()
    const selectedMonth = new Date('2021-11-01')
    const date = new Date('2021-12-01T00:00:00.000Z')

    await getWorkingBalanceAction.execute(selectedMonth, true)

    expect(workingBalanceRepository.getWorkingBalance).toHaveBeenCalledWith(date)
  })

  it('should make the request from actual date of the year selected when the year date is equal to the actual date', async () => {
    const { getWorkingBalanceAction, workingBalanceRepository } = setup()
    const selectedMonth = new Date('2022-01-01')
    const date = new Date('2022-02-01T00:00:00.000Z')

    await getWorkingBalanceAction.execute(selectedMonth, true)

    expect(workingBalanceRepository.getWorkingBalance).toHaveBeenCalledWith(date)
  })
})

function setup() {
  const workingBalanceRepository = mock<WorkingBalanceRepository>()

  const binnacleState = new BinnacleState()

  return {
    workingBalanceRepository,
    binnacleState,
    getWorkingBalanceAction: new GetWorkingBalanceAction(workingBalanceRepository, binnacleState)
  }
}
