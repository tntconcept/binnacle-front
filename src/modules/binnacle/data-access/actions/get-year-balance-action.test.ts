import { mock } from 'jest-mock-extended'
import {
  buildSearchRolesResponse,
  buildYearBalance,
  mockTimeSummary,
  mockTimeSummaryRelatedRoles
} from 'test-utils/generateTestMocks'
import { SearchRepository } from '../interfaces/search-repository'
import { GenerateYearBalance } from '../services/generate-year-balance'
import { BinnacleState } from '../state/binnacle-state'
import { GetYearBalanceAction } from './get-year-balance-action'

describe('GetYearBalanceAction', () => {
  it('should not generate balance of the year if working time status is empty', async () => {
    const { binnacleState, searchRepository, getYearBalanceAction } = setup()
    binnacleState.timeSummary = undefined

    getYearBalanceAction.execute()
    expect(searchRepository.roles).toHaveBeenCalledTimes(0)
  })

  it('should get roles information using SearchRepository with unique role ids', async () => {
    const { binnacleState, searchRepository, getYearBalanceAction } = setup()
    binnacleState.timeSummary = mockTimeSummary({
      months: [
        ...new Array(5).fill({
          workable: 0,
          worked: 0,
          recommended: 0,
          balance: 0,
          roles: [{ id: 1, worked: 0 }]
        }),
        ...new Array(5).fill({
          workable: 0,
          worked: 0,
          recommended: 0,
          balance: 0,
          roles: [
            { id: 2, worked: 0 },
            { id: 3, worked: 0 }
          ]
        })
      ]
    })

    getYearBalanceAction.execute()
    expect(searchRepository.roles).toHaveBeenCalledWith([1, 2, 3])
  })

  it('should generate the balance of the year with working time and search roles response', async () => {
    const { binnacleState, searchRepository, getYearBalanceAction, generateYearBalance } = setup()
    const workingTime = mockTimeSummaryRelatedRoles()
    const searchRolesResponse = buildSearchRolesResponse()
    binnacleState.timeSummary = workingTime
    searchRepository.roles.mockResolvedValue(searchRolesResponse)

    await getYearBalanceAction.execute()

    expect(generateYearBalance.generate).toHaveBeenCalledWith(workingTime, searchRolesResponse)
  })

  it('should save the year balance in the binnacle state', async () => {
    const { binnacleState, searchRepository, getYearBalanceAction, generateYearBalance } = setup()
    const workingTime = mockTimeSummaryRelatedRoles()
    const searchRolesResponse = buildSearchRolesResponse()
    binnacleState.timeSummary = workingTime
    searchRepository.roles.mockResolvedValue(searchRolesResponse)
    generateYearBalance.generate.mockReturnValue(buildYearBalance())

    await getYearBalanceAction.execute()

    expect(binnacleState.yearBalance).toBeTruthy()
  })
})

function setup() {
  const binnacleState = new BinnacleState()
  const searchRepository = mock<SearchRepository>()
  const generateYearBalance = mock<GenerateYearBalance>()

  return {
    searchRepository,
    binnacleState,
    generateYearBalance,
    getYearBalanceAction: new GetYearBalanceAction(
      binnacleState,
      searchRepository,
      generateYearBalance
    )
  }
}
