import { mock } from 'jest-mock-extended'
import { BinnacleState } from '../state/binnacle-state'
import { WorkingTimeRepository } from '../repositories/working-time-repository'
import { GetWorkingTimeAction } from './get-working-time-action'

beforeEach(() => {
  jest.useFakeTimers('modern').setSystemTime(new Date('2022-02-01').getTime())
})

describe('GetWorkingBalanceAction', () => {
  it('should get working time calculating the date from the binnacle state ', async () => {
    const { getWorkingTimeAction, workingTimeRepository, binnacleState } = setup()
    workingTimeRepository.getWorkingTime.mockResolvedValue({
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

    await getWorkingTimeAction.execute()

    expect(workingTimeRepository.getWorkingTime).toHaveBeenCalledWith(actualDate)
    expect(binnacleState.workingTime).toEqual({
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

  it('should get working time calculating the date from the selected month ', async () => {
    const { getWorkingTimeAction, workingTimeRepository, binnacleState } = setup()
    workingTimeRepository.getWorkingTime.mockResolvedValue({
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

    await getWorkingTimeAction.execute(selectedMonth, yearChanged)

    expect(workingTimeRepository.getWorkingTime).toHaveBeenCalledWith(date)
    expect(binnacleState.workingTime).toEqual({
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
    const { getWorkingTimeAction, workingTimeRepository } = setup()
    const selectedMonth = new Date('2023-02-01')
    const date = new Date('2023-01-01T00:00:00.000Z')

    await getWorkingTimeAction.execute(selectedMonth, true)

    expect(workingTimeRepository.getWorkingTime).toHaveBeenCalledWith(date)
  })

  it('should make the request from december of the year selected when the year date is minor than the actual date', async () => {
    const { getWorkingTimeAction, workingTimeRepository } = setup()
    const selectedMonth = new Date('2021-11-01')
    const date = new Date('2021-12-01T00:00:00.000Z')

    await getWorkingTimeAction.execute(selectedMonth, true)

    expect(workingTimeRepository.getWorkingTime).toHaveBeenCalledWith(date)
  })

  it('should make the request from actual date of the year selected when the year date is equal to the actual date', async () => {
    const { getWorkingTimeAction, workingTimeRepository } = setup()
    const selectedMonth = new Date('2022-01-01')
    const date = new Date('2022-02-01T00:00:00.000Z')

    await getWorkingTimeAction.execute(selectedMonth, true)

    expect(workingTimeRepository.getWorkingTime).toHaveBeenCalledWith(date)
  })
})

function setup() {
  const workingTimeRepository = mock<WorkingTimeRepository>()

  const binnacleState = new BinnacleState()

  return {
    workingTimeRepository,
    binnacleState,
    getWorkingTimeAction: new GetWorkingTimeAction(workingTimeRepository, binnacleState)
  }
}
