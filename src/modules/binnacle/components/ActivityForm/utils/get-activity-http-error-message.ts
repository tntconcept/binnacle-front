import i18n from 'shared/i18n/i18n'
import { CodeErrors } from '../../../../../shared/types/error-codes'

export const getActivityHttpErrorMessage = (error: any) => {
  if (error.response && error.response.status === 400) {
    const code = error.response.data.code

    switch (code) {
      case CodeErrors.ACTIVITY_TIME_OVERLAPS:
        return {
          400: {
            title: i18n.t('activity_api_errors.time_overlaps_title'),
            description: i18n.t('activity_api_errors.time_overlaps_description')
          }
        }
      case CodeErrors.CLOSED_PROJECT:
        return {
          400: {
            title: i18n.t('activity_api_errors.closed_project_title'),
            description: i18n.t('activity_api_errors.closed_project_description')
          }
        }
      case CodeErrors.ACTIVITY_PERIOD_CLOSED:
        return {
          400: {
            title: i18n.t('activity_api_errors.activity_closed_period_title'),
            description: i18n.t('activity_api_errors.activity_closed_period_description')
          }
        }
      case CodeErrors.ACTIVITY_BEFORE_HIRING_DATE:
        return {
          400: {
            title: i18n.t('activity_api_errors.activity_before_hiring_date_title'),
            description: i18n.t('activity_api_errors.activity_before_hiring_date_description')
          }
        }
    }
  }
}
