import { Command, UseCaseKey } from '@archimedes/arch'
import type { ToastType } from 'shared/di/container'
import { TOAST, VACATION_REPOSITORY } from 'shared/di/container-tokens'
import i18n from 'i18next'
import { Id } from 'shared/types/id'
import { inject, singleton } from 'tsyringe'
import type { VacationRepository } from '../domain/vacation-repository'

@UseCaseKey('DeleteVacationCmd')
@singleton()
export class DeleteVacationCmd extends Command<Id> {
  constructor(
    @inject(VACATION_REPOSITORY) private vacationRepository: VacationRepository,
    @inject(TOAST) private toast: ToastType
  ) {
    super()
  }

  async internalExecute(vacationId: Id): Promise<void> {
    await this.vacationRepository.delete(vacationId)

    this.toast({
      title: i18n.t('vacation.remove_vacation_notification'),
      status: 'success',
      duration: 10000,
      isClosable: true,
      position: 'top-right'
    })
  }
}
