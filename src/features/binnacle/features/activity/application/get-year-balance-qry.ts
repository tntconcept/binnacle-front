import { InvalidateCache, Query, UseCaseKey } from '@archimedes/arch'
import { singleton } from 'tsyringe'
import { SearchProjectRolesQry } from '../../search/application/search-project-roles-qry'
import { GenerateYearBalance } from '../domain/services/generate-year-balance'
import { YearBalance } from '../domain/year-balance'
import { GetTimeSummaryQry } from './get-time-summary-qry'

@UseCaseKey('GetYearBalanceQry')
@InvalidateCache
@singleton()
export class GetYearBalanceQry extends Query<YearBalance, Date> {
  constructor(
    private searchProjectRolesQry: SearchProjectRolesQry,
    private getTimeSummaryQry: GetTimeSummaryQry,
    private generateYearBalance: GenerateYearBalance
  ) {
    super()
  }

  async internalExecute(date: Date): Promise<YearBalance> {
    const timeSummary = await this.getTimeSummaryQry.execute(date)

    const projectRoleIds = timeSummary.months.flatMap((m) => m.roles.map((r) => r.id))
    const uniqueProjectRoleIds = Array.from(new Set(projectRoleIds))

    const projectRolesInformation = await this.searchProjectRolesQry.execute(uniqueProjectRoleIds)

    return this.generateYearBalance.generate(timeSummary, projectRolesInformation)
  }
}
