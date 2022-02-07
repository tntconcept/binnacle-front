import { IAction } from '../../../../shared/arch/interfaces/IAction'
import { singleton } from 'tsyringe'
import { BinnacleState } from '../state/binnacle-state'
import { action, makeObservable, runInAction } from 'mobx'
import chrono from '../../../../shared/utils/chrono'
import { WorkingBalanceRepository } from '../repositories/working-balance-repository'
import { WorkingBalance } from '../interfaces/working-balance.interface'

@singleton()
export class GetWorkingBalanceAction implements IAction<Date> {
  constructor(
    private workingBalanceRepository: WorkingBalanceRepository,
    private binnacleState: BinnacleState
  ) {
    makeObservable(this)
  }

  @action
  async execute(selectedMonth?: Date, yearChanged = false): Promise<void> {
    //selectedMonth will be undefined when on init or changing tabs
    if (selectedMonth === undefined || yearChanged) {
      const month = selectedMonth ? selectedMonth : this.binnacleState.selectedDate
      const date = chrono(month).getDate()
      const actualDate = new Date()
      let response: WorkingBalance

      if (month.getFullYear() === actualDate.getFullYear()) {
        response = await this.workingBalanceRepository.getWorkingBalance(actualDate)
      }

      if (month.getFullYear() > actualDate.getFullYear()) {
        const newDate = chrono(date)
          .set(0, 'month')
          .getDate()
        response = await this.workingBalanceRepository.getWorkingBalance(newDate)
      }

      if (month.getFullYear() < actualDate.getFullYear()) {
        const newDate = chrono(date)
          .set(11, 'month')
          .getDate()
        response = await this.workingBalanceRepository.getWorkingBalance(newDate)
      }

      runInAction(() => {
        this.binnacleState.workingBalance = response
      })
    }
  }
}
