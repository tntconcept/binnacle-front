import { Command, UseCaseKey } from '@archimedes/arch'
import { TOAST, VACATION_REPOSITORY } from '../../../../../shared/di/container-tokens'
import { inject, singleton } from 'tsyringe'
import { UpdateVacation } from '../domain/update-vacation'
import type { VacationRepository } from '../domain/vacation-repository'
import { i18n } from '../../../../../shared/i18n/i18n'
import type { ToastType } from '../../../../../shared/notification/toast'

@UseCaseKey('UpdateVacationCmd')
@singleton()
export class UpdateVacationCmd extends Command<UpdateVacation> {
  constructor(
    @inject(VACATION_REPOSITORY) private readonly vacationRepository: VacationRepository,
    @inject(TOAST) private readonly toast: ToastType
  ) {
    super()
  }

  async internalExecute(vacation: UpdateVacation): Promise<void> {
    const response = await this.vacationRepository.update(vacation)

    if (response !== undefined) {
      this.toast({
        title: i18n.t('vacation.create_vacation_notification_title'),
        description: i18n.t('vacation.create_vacation_notification_message_all', {
          year: response.chargeYear
        }),
        status: 'success',
        duration: 10000,
        isClosable: true,
        position: 'top-right'
      })
    }
  }
}
