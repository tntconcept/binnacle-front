import { Command, UseCaseKey } from '@archimedes/arch'
import type { ToastType } from 'shared/di/container'
import { ACTIVITY_REPOSITORY, TOAST } from 'shared/di/container-tokens'
import i18n from 'shared/i18n/i18n'
import { inject, singleton } from 'tsyringe'
import type { ActivityRepository } from '../domain/activity-repository'
import { UpdateActivity } from '../domain/update-activity'

@UseCaseKey('UpdateActivityCmd')
@singleton()
export class UpdateActivityCmd extends Command<UpdateActivity> {
  constructor(
    @inject(ACTIVITY_REPOSITORY) private activityRepository: ActivityRepository,
    @inject(TOAST) private toast: ToastType
  ) {
    super()
  }
  async internalExecute(activity: UpdateActivity): Promise<void> {
    await this.activityRepository.update(activity)

    this.toast({
      title: i18n.t('activity_form.update_activity_notification'),
      status: 'success',
      duration: 10000,
      isClosable: true,
      position: 'top-right'
    })
  }
}
