import { action, makeObservable } from 'mobx'
import { GetCalendarDataAction } from 'modules/binnacle/data-access/actions/get-calendar-data-action'
import { inject, singleton } from 'tsyringe'
import type { IAction } from 'shared/arch/interfaces/IAction'
import {
  ACTIVITY_REPOSITORY,
  TOAST
} from '../../../../shared/data-access/ioc-container/ioc-container.tokens'
import type { ToastType } from '../../../../shared/data-access/ioc-container/ioc-container'
import i18n from 'i18next'
import type { ActivityRepository } from '../interfaces/activity-repository'

@singleton()
export class DeleteActivityAction implements IAction<number> {
  constructor(
    @inject(ACTIVITY_REPOSITORY) private activityRepository: ActivityRepository,
    private getCalendarDataAction: GetCalendarDataAction,
    @inject(TOAST) private toast: ToastType
  ) {
    makeObservable(this)
  }

  @action
  async execute(activityId: number): Promise<void> {
    await this.activityRepository.deleteActivity(activityId)
    await this.getCalendarDataAction.execute()

    this.toast({
      title: i18n.t('activity_form.remove_activity_notification'),
      status: 'success',
      duration: 10000,
      isClosable: true,
      position: 'top-right'
    })
  }
}
