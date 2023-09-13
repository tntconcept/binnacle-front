import { Command, UseCaseKey } from '@archimedes/arch'
import { TOAST, VACATION_REPOSITORY } from '../../../../../shared/di/container-tokens'
import { inject, singleton } from 'tsyringe'
import { NewVacation } from '../domain/new-vacation'
import type { VacationRepository } from '../domain/vacation-repository'
import { i18n } from '../../../../../shared/i18n/i18n'
import type { ToastType } from '../../../../../shared/notification/toast'

interface CreateVacationParams {
  newVacation: NewVacation
  chargeYear: number
}

@UseCaseKey('CreateVacationCmd')
@singleton()
export class CreateVacationCmd extends Command<CreateVacationParams> {
  constructor(
    @inject(VACATION_REPOSITORY) private readonly vacationRepository: VacationRepository,
    @inject(TOAST) private readonly toast: ToastType
  ) {
    super()
  }

  async internalExecute(param: CreateVacationParams): Promise<void> {
    const response = await this.vacationRepository.create(param.newVacation, param.chargeYear)

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
