import { action, runInAction } from 'mobx'
import { IAction } from 'shared/arch/interfaces/IAction'
import { singleton } from 'tsyringe'
import type { RecentRole } from '../interfaces/recent-role'
import { BinnacleState } from '../state/binnacle-state'

@singleton()
export class AddRecentRoleAction implements IAction<RecentRole> {
  constructor(private binnacleState: BinnacleState) {}

  @action
  async execute(recentRole: RecentRole): Promise<void> {
    runInAction(() => {
      this.binnacleState.recentRoles = [recentRole, ...this.binnacleState.recentRoles].filter(
        (recentRole, index, self) => index === self.findIndex((t) => t.id === recentRole.id)
      )
    })
  }
}
