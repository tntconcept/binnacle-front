import { Command, UseCaseKey } from '@archimedes/arch'
import type { ToastType } from 'shared/di/container'
import { ACTIVITY_REPOSITORY, TOAST } from 'shared/di/container-tokens'
import i18n from 'i18next'
import { Id } from 'shared/types/id'
import { inject, singleton } from 'tsyringe'
import type { ActivityRepository } from '../domain/activity-repository'

@UseCaseKey('DeleteActivityCmd')
@singleton()
export class DeleteActivityCmd extends Command<Id> {
  constructor(
    @inject(ACTIVITY_REPOSITORY) private activityRepository: ActivityRepository,
    @inject(TOAST) private toast: ToastType
  ) {
    super()
  }

  async internalExecute(id: Id): Promise<void> {
    // TODO: review error handle of getActivityHttpErrorMessage
    await this.activityRepository.delete(id)

    this.toast({
      title: i18n.t('activity_form.remove_activity_notification'),
      status: 'success',
      duration: 10000,
      isClosable: true,
      position: 'top-right'
    })
  }
}
