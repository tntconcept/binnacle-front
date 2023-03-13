import { action, makeObservable, runInAction } from 'mobx'
import { VacationsState } from 'modules/vacations/data-access/state/vacations-state'
import type { VacationsRepository } from 'modules/vacations/data-access/interfaces/vacations-repository'
import { inject, singleton } from 'tsyringe'
import type { IAction } from 'shared/arch/interfaces/IAction'
import { VACATIONS_REPOSITORY } from 'shared/data-access/ioc-container/ioc-container.tokens'

@singleton()
export class GetVacationsByYearAction implements IAction<number> {
  constructor(
    @inject(VACATIONS_REPOSITORY) private vacationsRepository: VacationsRepository,
    private vacationsState: VacationsState
  ) {
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
