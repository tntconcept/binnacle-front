import { action, makeObservable, runInAction } from 'mobx'
import { VacationsState } from 'modules/vacations/data-access/state/vacations-state'
import { VacationsRepository } from 'modules/vacations/data-access/repositories/vacations-repository'
import { singleton } from 'tsyringe'
import type { IAction } from 'shared/arch/interfaces/IAction'

@singleton()
export class GetVacationsByYearAction implements IAction<number> {
  constructor(private vacationsRepository: VacationsRepository, private vacationsState: VacationsState) {
    makeObservable(this)
  }

  @action
  async execute(selectedYear?: number): Promise<void> {
    const chargeYear = selectedYear ? selectedYear : this.vacationsState.selectedYear

    const { vacations } = await this.vacationsRepository.getVacationsByChargeYear(chargeYear)
    const details = await this.vacationsRepository.getVacationDetailsByChargeYear(chargeYear)

    runInAction(() => {
      this.vacationsState.vacations = vacations
      this.vacationsState.vacationDetails = details

      if (selectedYear) {
        this.vacationsState.selectedYear = selectedYear
      }
    })
  }
}
