import { action, makeObservable } from 'mobx'
import { GetVacationsByYearAction } from 'modules/vacations/data-access/actions/get-vacations-by-year-action'
import { VacationsRepository } from 'modules/vacations/data-access/repositories/vacations-repository'
import { singleton } from 'tsyringe'
import type { IAction } from 'shared/arch/interfaces/IAction'

@singleton()
export class DeleteVacationPeriodAction implements IAction<number> {
  constructor(
    private vacationsRepository: VacationsRepository,
    private getVacationsByYearAction: GetVacationsByYearAction
  ) {
    makeObservable(this)
  }

  @action
  async execute(vacationId: number): Promise<void> {
    await this.vacationsRepository.deleteVacationPeriod(vacationId)
    await this.getVacationsByYearAction.execute(undefined)
  }
}
