import { Command, UseCaseKey } from '@archimedes/arch'
import i18n from 'i18next'
import type { ToastType } from 'shared/di/container'
import { ACTIVITY_REPOSITORY, TOAST } from 'shared/di/container-tokens'
import { inject, singleton } from 'tsyringe'
import type { ActivityRepository } from '../domain/activity-repository'
import { NewActivity } from '../domain/new-activity'

@UseCaseKey('CreateActivityCmd')
@singleton()
export class CreateActivityCmd extends Command<NewActivity> {
  constructor(
    @inject(ACTIVITY_REPOSITORY) private activityRepository: ActivityRepository,
    @inject(TOAST) private toast: ToastType
  ) {
    super()
  }
  async internalExecute(newActivity: NewActivity): Promise<void> {
    await this.activityRepository.create(newActivity)

    this.toast({
      title: i18n.t('activity_form.create_activity_notification'),
      status: 'success',
      duration: 10000,
      isClosable: true,
      position: 'top-right'
    })
  }
}
