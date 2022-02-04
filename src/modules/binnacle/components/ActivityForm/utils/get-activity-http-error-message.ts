import i18n from 'shared/i18n/i18n'

export const getActivityHttpErrorMessage = (error: any) => {
  let notificationErrorMessage = undefined

  if (error.response && error.response.status === 400) {
    if (error.response.data.code === 'ACTIVITY_TIME_OVERLAPS') {
      notificationErrorMessage = {
        400: {
          title: i18n.t('activity_api_errors.time_overlaps_title'),
          description: i18n.t('activity_api_errors.time_overlaps_description')
        }
      }
    } else if (error.response.data.code === 'CLOSED_PROJECT') {
      notificationErrorMessage = {
        400: {
          title: i18n.t('activity_api_errors.closed_project_title'),
          description: i18n.t('activity_api_errors.closed_project_description')
        }
      }
    } else if (error.response.data.code === 'ACTIVITY_PERIOD_CLOSED') {
      notificationErrorMessage = {
        400: {
          title: i18n.t('activity_api_errors.activity_closed_period_title'),
          description: i18n.t('activity_api_errors.activity_closed_period_description')
        }
      }
    }
  }

  return notificationErrorMessage
}
