import { action, makeObservable } from 'mobx'
import { VacationsRepository } from 'modules/vacations/data-access/repositories/vacations-repository'
import { singleton } from 'tsyringe'
import type { IAction } from 'shared/arch/interfaces/IAction'

@singleton()
export class GetCorrespondingVacationDaysAction
  implements IAction<{ startDate: string; endDate: string }> {
  constructor(private vacationsRepository: VacationsRepository) {
    makeObservable(this)
  }

  @action
  // @ts-ignore
  async execute(param: { startDate: string; endDate: string }): Promise<number> {
    return await this.vacationsRepository.getCorrespondingVacationDays(param.startDate, param.endDate)
  }
}
