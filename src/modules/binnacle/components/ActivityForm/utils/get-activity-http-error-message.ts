import i18n from 'shared/i18n/i18n'
import { CodeErrors } from '../../../../../shared/types/error-codes'

export const getActivityHttpErrorMessage = (error: any) => {
  let notificationErrorMessage = undefined

  if (error.response && error.response.status === 400) {
    const code = error.response.data.code

    switch (code) {
      case CodeErrors.ACTIVITY_TIME_OVERLAPS:
        return notificationErrorMessage = {
          400: {
            title: i18n.t('activity_api_errors.time_overlaps_title'),
            description: i18n.t('activity_api_errors.time_overlaps_description')
          }
        }
      case CodeErrors.CLOSED_PROJECT:
        return notificationErrorMessage = {
          400: {
            title: i18n.t('activity_api_errors.closed_project_title'),
            description: i18n.t('activity_api_errors.closed_project_description')
          }
        }
      case CodeErrors.ACTIVITY_PERIOD_CLOSED:
        return notificationErrorMessage = {
          400: {
            title: i18n.t('activity_api_errors.activity_closed_period_title'),
            description: i18n.t('activity_api_errors.activity_closed_period_description')
          }
        }
    }
  }
}
