import { describe, expect, it } from 'vitest'
import { anyArray, mock } from 'vitest-mock-extended'
import { ActivityMother } from '../../../../../test-utils/mothers/activity-mother'
import { SearchMother } from '../../../../../test-utils/mothers/search-mother'
import { SearchProjectRolesQry } from '../../search/application/search-project-roles-qry'
import { GenerateYearBalance } from '../domain/services/generate-year-balance'
import { GetTimeSummaryQry } from './get-time-summary-qry'
import { GetYearBalanceQry } from './get-year-balance-qry'

describe('GetYearBalanceQry', () => {
  it('should get year balance by date', async () => {
    const {
      getYearBalanceQry,
      getTimeSummaryQry,
      searchProjectRolesQry,
      generateYearBalance,
      date,
      timeSummary,
      projectInformation
    } = setup()

    await getYearBalanceQry.internalExecute(date)

    expect(getTimeSummaryQry.execute).toBeCalledWith(date)
    expect(searchProjectRolesQry.execute).toBeCalledWith({ ids: anyArray(), year: 2000 })
    expect(generateYearBalance.generate).toBeCalledWith(timeSummary, projectInformation)
  })
})

function setup() {
  const searchProjectRolesQry = mock<SearchProjectRolesQry>()
  const getTimeSummaryQry = mock<GetTimeSummaryQry>()
  const generateYearBalance = mock<GenerateYearBalance>()

  const date = new Date('2000-03-01T09:00:00.000Z')

  const timeSummary = ActivityMother.timeSummary()
  getTimeSummaryQry.execute.calledWith(date).mockResolvedValue(timeSummary)

  const projectInformation = SearchMother.roles()
  searchProjectRolesQry.execute.mockResolvedValue(projectInformation)

  return {
    getYearBalanceQry: new GetYearBalanceQry(
      searchProjectRolesQry,
      getTimeSummaryQry,
      generateYearBalance
    ),
    searchProjectRolesQry,
    getTimeSummaryQry,
    generateYearBalance,
    date,
    timeSummary,
    projectInformation
  }
}
