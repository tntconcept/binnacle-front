import { action, makeObservable, runInAction } from 'mobx'
import type { TimeBalance } from 'modules/binnacle/data-access/interfaces/time-balance.interface'
import { TimeBalanceRepository } from 'modules/binnacle/data-access/repositories/time-balance-repository'
import { BinnacleState } from 'modules/binnacle/data-access/state/binnacle-state'
import { AppState } from 'shared/data-access/state/app-state'
import chrono from 'shared/utils/chrono'
import { singleton } from 'tsyringe'
import type { IAction } from 'shared/arch/interfaces/IAction'

@singleton()
export class GetTimeBalanceByMonthAction implements IAction<Date> {
  constructor(
    private timeBalanceRepository: TimeBalanceRepository,
    private appState: AppState,
    private binnacleState: BinnacleState
  ) {
    makeObservable(this)
  }

  @action
  async execute(selectedMonth?: Date): Promise<void> {
    const month = selectedMonth ? selectedMonth : this.binnacleState.selectedDate

    const startDate = chrono(month).startOf('month').getDate()
    const endDate = chrono(month).endOf('month').getDate()

    const hiredSameMonth = chrono(this.appState.loggedUser!.hiringDate).isSame(month, 'month')

    let response: Record<string, TimeBalance>

    if (hiredSameMonth) {
      response = await this.timeBalanceRepository.getTimeBalance(
        this.appState.loggedUser!.hiringDate,
        endDate
      )
    } else {
      response = await this.timeBalanceRepository.getTimeBalance(startDate, endDate)
    }

    const timeBalance = response[this.getTimeBalanceKey(startDate)]

    runInAction(() => {
      this.binnacleState.timeBalance = timeBalance
      this.binnacleState.selectedTimeBalanceMode = 'by-month'
    })
  }

  private getTimeBalanceKey(month: Date) {
    const monthNumber = ('0' + (month.getMonth() + 1).toString()).slice(-2)
    return month.getFullYear() + '-' + monthNumber + '-01'
  }
}
