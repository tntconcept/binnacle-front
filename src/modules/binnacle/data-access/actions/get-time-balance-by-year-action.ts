import { action, makeObservable, runInAction } from 'mobx'
import type { TimeBalance } from 'modules/binnacle/data-access/interfaces/time-balance.interface'
import { TimeBalanceRepository } from 'modules/binnacle/data-access/repositories/time-balance-repository'
import { BinnacleState } from 'modules/binnacle/data-access/state/binnacle-state'
import { AppState } from 'shared/data-access/state/app-state'
import chrono from 'shared/utils/chrono'
import { singleton } from 'tsyringe'
import type { IAction } from 'shared/arch/interfaces/IAction'

@singleton()
export class GetTimeBalanceByYearAction implements IAction<Date> {
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

    const startDate = chrono(month).startOf('year').getDate()
    const endDate = chrono(month).endOf('month').getDate()

    const hiredSameYear = chrono(this.appState.loggedUser!.hiringDate).isSame(month, 'year')

    let response: Record<string, TimeBalance>

    if (hiredSameYear) {
      response = await this.timeBalanceRepository.getTimeBalance(
        this.appState.loggedUser!.hiringDate,
        endDate
      )
    } else {
      response = await this.timeBalanceRepository.getTimeBalance(startDate, endDate)
    }

    runInAction(() => {
      this.binnacleState.timeBalance = this.getTotalTime(response, chrono(month).get('year'))
      this.binnacleState.selectedTimeBalanceMode = 'by-year'
    })
  }

  private getTotalTime(response: Record<string, TimeBalance>, selectedYear: number): TimeBalance {
    const onlySelectedYear = Object.fromEntries(
      Object.entries(response).filter(([key]) => key.includes(selectedYear.toString()))
    )

    const totalTime = Object.values(onlySelectedYear).reduce((prevValue, currentValue) => ({
      timeWorked: prevValue.timeWorked + currentValue.timeWorked,
      timeToWork: prevValue.timeToWork + currentValue.timeToWork,
      timeDifference: prevValue.timeDifference + currentValue.timeDifference
    }))

    return {
      timeWorked: totalTime.timeWorked,
      timeToWork: totalTime.timeToWork,
      timeDifference: totalTime.timeDifference
    }
  }
}
