import { action, makeObservable, runInAction } from 'mobx'
import type { IAction } from 'shared/arch/interfaces/IAction'
import { singleton } from 'tsyringe'
import { SearchRepository } from '../repositories/search-repository'
import { GenerateYearBalance } from '../services/generate-year-balance'
import { BinnacleState } from '../state/binnacle-state'

@singleton()
export class GetYearBalanceAction implements IAction {
  constructor(
    private binnacleState: BinnacleState,
    private searchRepository: SearchRepository,
    private generateYearBalance: GenerateYearBalance
  ) {
    makeObservable(this)
  }

  @action
  async execute(): Promise<void> {
    if (!this.binnacleState.workingTime) return

    const roleIds = this.binnacleState.workingTime.months.flatMap((m) => m.roles.map((r) => r.id))
    const uniqueRoleIds = Array.from(new Set(roleIds))

    const rolesInformation = await this.searchRepository.roles(uniqueRoleIds)

    const yearBalance = this.generateYearBalance.generate(
      this.binnacleState.workingTime,
      rolesInformation
    )

    runInAction(() => {
      this.binnacleState.yearBalance = yearBalance
    })
  }
}
