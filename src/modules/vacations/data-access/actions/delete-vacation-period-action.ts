import { action, makeObservable } from 'mobx'
import { GetVacationsByYearAction } from 'modules/vacations/data-access/actions/get-vacations-by-year-action'
import { VacationsRepository } from 'modules/vacations/data-access/repositories/vacations-repository'
import { inject, singleton } from 'tsyringe'
import type { IAction } from 'shared/arch/interfaces/IAction'
import i18n from 'i18next'
import { TOAST } from '../../../../shared/data-access/ioc-container/ioc-container.types'
import type { ToastType } from '../../../../shared/data-access/ioc-container/ioc-container'

@singleton()
export class DeleteVacationPeriodAction implements IAction<number> {
  constructor(
    private vacationsRepository: VacationsRepository,
    private getVacationsByYearAction: GetVacationsByYearAction,
    @inject(TOAST) private toast: ToastType
  ) {
    makeObservable(this)
  }

  @action
  async execute(vacationId: number): Promise<void> {
    await this.vacationsRepository.deleteVacationPeriod(vacationId)
    await this.getVacationsByYearAction.execute()

    this.toast({
      title: i18n.t('vacation.remove_vacation_notification'),
      status: 'success',
      duration: 10000,
      isClosable: true,
      position: 'top-right'
    })
  }
}
