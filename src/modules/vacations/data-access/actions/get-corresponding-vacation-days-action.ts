import { action, makeObservable } from 'mobx'
import type { VacationsRepository } from 'modules/vacations/data-access/interfaces/vacations-repository'
import { inject, singleton } from 'tsyringe'
import type { IAction } from 'shared/arch/interfaces/IAction'
import { VACATIONS_REPOSITORY } from 'shared/data-access/ioc-container/ioc-container.tokens'

@singleton()
export class GetCorrespondingVacationDaysAction
  implements IAction<{ startDate: string; endDate: string }>
{
  constructor(@inject(VACATIONS_REPOSITORY) private vacationsRepository: VacationsRepository) {
    makeObservable(this)
  }

  @action
  // @ts-ignore
  async execute(param: { startDate: string; endDate: string }): Promise<number> {
    return await this.vacationsRepository.getCorrespondingVacationDays(
      param.startDate,
      param.endDate
    )
  }
}
