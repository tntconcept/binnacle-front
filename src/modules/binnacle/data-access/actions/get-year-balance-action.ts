import { action, makeObservable, runInAction } from 'mobx'
import type { IAction } from 'shared/arch/interfaces/IAction'
import { SEARCH_REPOSITORY } from 'shared/data-access/ioc-container/ioc-container.tokens'
import { inject, singleton } from 'tsyringe'
import type { SearchRepository } from '../interfaces/search-repository'
import { GenerateYearBalance } from '../services/generate-year-balance'
import { BinnacleState } from '../state/binnacle-state'

@singleton()
export class GetYearBalanceAction implements IAction {
  constructor(
    private binnacleState: BinnacleState,
    @inject(SEARCH_REPOSITORY) private searchRepository: SearchRepository,
    private generateYearBalance: GenerateYearBalance
  ) {
    makeObservable(this)
  }

  @action
  async execute(): Promise<void> {
    if (!this.binnacleState.timeSummary) return

    const roleIds = this.binnacleState.timeSummary.months.flatMap((m) => m.roles.map((r) => r.id))
    const uniqueRoleIds = Array.from(new Set(roleIds))

    const rolesInformation = await this.searchRepository.roles(uniqueRoleIds)
    const yearBalance = this.generateYearBalance.generate(
      this.binnacleState.timeSummary,
      rolesInformation
    )

    runInAction(() => {
      this.binnacleState.yearBalance = yearBalance
    })
  }
}
