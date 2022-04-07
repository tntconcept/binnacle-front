import { action, makeObservable } from 'mobx'
import { GetCalendarDataAction } from 'modules/binnacle/data-access/actions/get-calendar-data-action'
import { ActivitiesRepository } from 'modules/binnacle/data-access/repositories/activities-repository'
import { inject, singleton } from 'tsyringe'
import type { IAction } from 'shared/arch/interfaces/IAction'
import { TOAST } from '../../../../shared/data-access/ioc-container/ioc-container.types'
import type { ToastType } from '../../../../shared/data-access/ioc-container/ioc-container'
import i18n from 'i18next'

@singleton()
export class DeleteActivityAction implements IAction<number> {
  constructor(
    private activitiesRepository: ActivitiesRepository,
    private getCalendarDataAction: GetCalendarDataAction,
    @inject(TOAST) private toast: ToastType
  ) {
    makeObservable(this)
  }

  @action
  async execute(activityId: number): Promise<void> {
    await this.activitiesRepository.deleteActivity(activityId)
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
