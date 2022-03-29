import { IAction } from '../../../../shared/arch/interfaces/IAction'
import { singleton } from 'tsyringe'
import { BinnacleState } from '../state/binnacle-state'
import { action, makeObservable, runInAction } from 'mobx'
import chrono from '../../../../shared/utils/chrono'
import { WorkingTimeRepository } from '../repositories/working-time-repository'
import { WorkingTime } from '../interfaces/working-time.interface'

@singleton()
export class GetWorkingTimeAction implements IAction<Date> {
  constructor(
    private workingTimeRepository: WorkingTimeRepository,
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
      let response: WorkingTime

      if (month.getFullYear() === actualDate.getFullYear()) {
        response = await this.workingTimeRepository.getWorkingTime(actualDate)
      }

      if (month.getFullYear() > actualDate.getFullYear()) {
        const newDate = chrono(date).set(0, 'month').getDate()
        response = await this.workingTimeRepository.getWorkingTime(newDate)
      }

      if (month.getFullYear() < actualDate.getFullYear()) {
        const newDate = chrono(date).set(11, 'month').getDate()
        response = await this.workingTimeRepository.getWorkingTime(newDate)
      }

      runInAction(() => {
        this.binnacleState.workingTime = response
      })
    }
  }
}
