import { IAction } from '../../../../shared/arch/interfaces/IAction'
import { singleton } from 'tsyringe'
import { BinnacleState } from '../state/binnacle-state'
import { action, makeObservable, runInAction } from 'mobx'
import chrono from '../../../../shared/utils/chrono'
import { WorkingBalance } from '../interfaces/working-balance.interface'
import { WorkingBalanceRepository } from '../repositories/working-balance-repository'

@singleton()
export class GetWorkingBalanceAction implements IAction<Date> {

  constructor(
    private workingBalanceRepository: WorkingBalanceRepository,
    private binnacleState: BinnacleState
  ) {
    makeObservable(this)
  }

  @action
  async execute(selectedMonth?: Date): Promise<void> {
    const month = selectedMonth ? selectedMonth : this.binnacleState.selectedDate

    const date = chrono(month).getDate()

    let response: WorkingBalance

    if (selectedMonth?.getFullYear() !== this.binnacleState.selectedDate.getFullYear()) {
      response = await this.workingBalanceRepository.getWorkingBalance(date)
    }

    runInAction(() => {
      this.binnacleState.workingBalance = response
    })
  }
}