import { action, makeObservable } from 'mobx'
import type { ActivityFormSchema } from 'modules/binnacle/components/ActivityForm/ActivityForm.schema'
import { GetCalendarDataAction } from 'modules/binnacle/data-access/actions/get-calendar-data-action'
import chrono from 'shared/utils/chrono'
import { timeToDate } from 'shared/utils/helpers'
import { inject, singleton } from 'tsyringe'
import type { IAction } from 'shared/arch/interfaces/IAction'
import {
  ACTIVITY_REPOSITORY,
  TOAST
} from '../../../../shared/data-access/ioc-container/ioc-container.tokens'
import type { ToastType } from '../../../../shared/data-access/ioc-container/ioc-container'
import i18n from 'i18next'
import type { ActivityRepository } from '../interfaces/activity-repository'

interface Param {
  activityId: number | undefined
  activityDate: Date
  values: ActivityFormSchema
}

@singleton()
export class SubmitActivityFormAction implements IAction<Param> {
  constructor(
    @inject(ACTIVITY_REPOSITORY) private activityRepository: ActivityRepository,
    private getCalendarDataAction: GetCalendarDataAction,
    @inject(TOAST) private toast: ToastType
  ) {
    makeObservable(this)
  }

  @action
  async execute(param: Param): Promise<void> {
    const projectRoleId = param.values.showRecentRole
      ? param.values.recentRole!.id
      : param.values.role!.id
    const duration = chrono(timeToDate(param.values.start, param.activityDate)).diff(
      timeToDate(param.values.end, param.activityDate),
      'minute'
    )

    const preparedValue = {
      startDate: timeToDate(param.values.start, param.activityDate),
      duration: duration,
      billable: param.values.billable,
      description: param.values.description,
      projectRoleId: projectRoleId,
      hasImage: param.values.imageBase64 !== null,
      imageFile: param.values.imageBase64 !== null ? param.values.imageBase64 : undefined
    }

    if (param.activityId) {
      await this.activityRepository.updateActivity({
        id: param.activityId,
        ...preparedValue
      })

      this.toast({
        title: i18n.t('activity_form.update_activity_notification'),
        status: 'success',
        duration: 10000,
        isClosable: true,
        position: 'top-right'
      })
    } else {
      await this.activityRepository.createActivity({
        id: undefined,
        ...preparedValue
      })

      this.toast({
        title: i18n.t('activity_form.create_activity_notification'),
        status: 'success',
        duration: 10000,
        isClosable: true,
        position: 'top-right'
      })
    }

    await this.getCalendarDataAction.execute()
  }
}
