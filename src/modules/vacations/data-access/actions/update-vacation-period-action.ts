import i18n from 'shared/i18n/i18n'
import { action, makeObservable } from 'mobx'
import { GetVacationsByYearAction } from 'modules/vacations/data-access/actions/get-vacations-by-year-action'
import { VacationsRepository } from 'modules/vacations/data-access/repositories/vacations-repository'
import type { VacationPeriodRequest } from 'modules/vacations/data-access/vacation'
import type { ToastType } from 'shared/data-access/ioc-container/ioc-container'
import { TOAST } from 'shared/data-access/ioc-container/ioc-container.types'
import { inject, singleton } from 'tsyringe'
import type { IAction } from 'shared/arch/interfaces/IAction'

@singleton()
export class UpdateVacationPeriodAction implements IAction<VacationPeriodRequest & { id: number }> {
  constructor(
    private vacationsRepository: VacationsRepository,
    private getVacationsByYearCmd: GetVacationsByYearAction,
    @inject(TOAST) private toast: ToastType
  ) {
    makeObservable(this)
  }

  @action
  async execute(values: VacationPeriodRequest & { id: number }): Promise<void> {
    const response = await this.vacationsRepository.updateVacationPeriod(values)

    await this.getVacationsByYearCmd.execute(undefined)

    if (response !== undefined) {
      const description =
        response.length === 1
          ? i18n.t('vacation.create_vacation_notification_message_all', {
              year: response[0].chargeYear
            })
          : i18n.t('vacation.create_period_notification_message_by_year', {
              count: response[0].days,
              daysFirstYear: response[0].days,
              firstYear: response[0].chargeYear,
              secondYear: response[1].chargeYear
            })

      this.toast({
        title: i18n.t('vacation.create_vacation_notification_title'),
        description: description,
        status: 'success',
        duration: 10000,
        isClosable: true,
        position: 'top-right'
      })
    }
  }
}
