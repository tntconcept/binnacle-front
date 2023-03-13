import { IAction } from '../../../../shared/arch/interfaces/IAction'
import { inject, singleton } from 'tsyringe'
import { BinnacleState } from '../state/binnacle-state'
import { action, makeObservable, runInAction } from 'mobx'
import chrono from '../../../../shared/utils/chrono'
import type { TimeSummaryRepository } from '../interfaces/time-summary-repository'
import { TIME_SUMMARY_REPOSITORY } from 'shared/data-access/ioc-container/ioc-container.tokens'
import { TimeSummary } from '../interfaces/time-summary.interface'

@singleton()
export class GetTimeSummaryAction implements IAction<Date> {
  constructor(
    @inject(TIME_SUMMARY_REPOSITORY) private timeSummaryRepository: TimeSummaryRepository,
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
      let response: TimeSummary

      if (month.getFullYear() === actualDate.getFullYear()) {
        response = await this.timeSummaryRepository.getTimeSummary(actualDate)
      }

      if (month.getFullYear() > actualDate.getFullYear()) {
        const newDate = chrono(date).set(0, 'month').getDate()
        response = await this.timeSummaryRepository.getTimeSummary(newDate)
      }

      if (month.getFullYear() < actualDate.getFullYear()) {
        const newDate = chrono(date).set(11, 'month').getDate()
        response = await this.timeSummaryRepository.getTimeSummary(newDate)
      }

      runInAction(() => {
        this.binnacleState.timeSummary = response
      })
    }
  }
}
