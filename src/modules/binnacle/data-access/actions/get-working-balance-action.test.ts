import { mock } from 'jest-mock-extended'
import { BinnacleState } from '../state/binnacle-state'
import { WorkingBalanceRepository } from '../repositories/working-balance-repository'
import { GetWorkingBalanceAction } from './get-working-balance-action'

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
    const date = new Date('2022-01-01T00:00:00.000Z')

    await getWorkingBalanceAction.execute()

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

    await getWorkingBalanceAction.execute(selectedMonth)

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

  it('should not get working balance calculating when the year of the selected month is the same of the year of the binnacle state selected date ', async () => {
    const { getWorkingBalanceAction, workingBalanceRepository, binnacleState } = setup()
    binnacleState.selectedDate = new Date('2021-10-01')
    const selectedMonth = new Date('2021-12-01')

    await getWorkingBalanceAction.execute(selectedMonth)

    expect(workingBalanceRepository.getWorkingBalance).toHaveBeenCalledTimes(0)

  })

})

function setup() {
  const workingBalanceRepository = mock<WorkingBalanceRepository>()

  const binnacleState = new BinnacleState()

  return {
    workingBalanceRepository,
    binnacleState,
    getWorkingBalanceAction: new GetWorkingBalanceAction(
      workingBalanceRepository,
      binnacleState
    )
  }
}