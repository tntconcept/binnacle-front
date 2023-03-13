import { mock } from 'jest-mock-extended'
import { BinnacleState } from '../state/binnacle-state'
import { TimeSummaryRepository } from '../interfaces/time-summary-repository'
import { GetTimeSummaryAction } from './get-time-summary-action'
import { mockTimeSummary } from 'test-utils/generateTestMocks'

beforeEach(() => {
  jest.useFakeTimers('modern').setSystemTime(new Date('2022-02-01').getTime())
})

describe('GetTimeSummaryAction', () => {
  it('should get working time calculating the date from the binnacle state ', async () => {
    const { getTimeSummaryAction, timeSummaryRepository, binnacleState } = setup()
    timeSummaryRepository.getTimeSummary.mockResolvedValue(mockTimeSummary())
    binnacleState.selectedDate = new Date('2022-01-01')
    const actualDate = new Date('2022-02-01')

    await getTimeSummaryAction.execute()

    expect(timeSummaryRepository.getTimeSummary).toHaveBeenCalledWith(actualDate)
    expect(binnacleState.timeSummary).toEqual(mockTimeSummary())
  })

  it('should get working time calculating the date from the selected month ', async () => {
    const { getTimeSummaryAction, timeSummaryRepository, binnacleState } = setup()
    timeSummaryRepository.getTimeSummary.mockResolvedValue(mockTimeSummary())
    binnacleState.selectedDate = new Date('2022-01-01')
    const date = new Date('2021-12-01T00:00:00.000Z')
    const selectedMonth = new Date('2021-12-01')
    const yearChanged = selectedMonth.getFullYear() !== binnacleState.selectedDate.getFullYear()

    await getTimeSummaryAction.execute(selectedMonth, yearChanged)

    expect(timeSummaryRepository.getTimeSummary).toHaveBeenCalledWith(date)
    expect(binnacleState.timeSummary).toEqual(mockTimeSummary())
  })

  it('should make the request from january of the year selected when the year date is major than the actual date', async () => {
    const { getTimeSummaryAction, timeSummaryRepository: timeSummaryRepository } = setup()
    const selectedMonth = new Date('2023-02-01')
    const date = new Date('2023-01-01T00:00:00.000Z')

    await getTimeSummaryAction.execute(selectedMonth, true)

    expect(timeSummaryRepository.getTimeSummary).toHaveBeenCalledWith(date)
  })

  it('should make the request from december of the year selected when the year date is minor than the actual date', async () => {
    const { getTimeSummaryAction, timeSummaryRepository: timeSummaryRepository } = setup()
    const selectedMonth = new Date('2021-11-01')
    const date = new Date('2021-12-01T00:00:00.000Z')

    await getTimeSummaryAction.execute(selectedMonth, true)

    expect(timeSummaryRepository.getTimeSummary).toHaveBeenCalledWith(date)
  })

  it('should make the request from actual date of the year selected when the year date is equal to the actual date', async () => {
    const { getTimeSummaryAction, timeSummaryRepository: timeSummaryRepository } = setup()
    const selectedMonth = new Date('2022-01-01')
    const date = new Date('2022-02-01T00:00:00.000Z')

    await getTimeSummaryAction.execute(selectedMonth, true)

    expect(timeSummaryRepository.getTimeSummary).toHaveBeenCalledWith(date)
  })
})

function setup() {
  const timeSummaryRepository = mock<TimeSummaryRepository>()

  const binnacleState = new BinnacleState()

  return {
    timeSummaryRepository,
    binnacleState,
    getTimeSummaryAction: new GetTimeSummaryAction(timeSummaryRepository, binnacleState)
  }
}
