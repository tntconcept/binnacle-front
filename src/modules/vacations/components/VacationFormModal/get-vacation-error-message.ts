import i18n from 'shared/i18n/i18n'

export const getVacationErrorMessage = (error: any) => {
  let notificationErrorMessage = undefined

  if (error.response && error.response.status === 400) {
    if (error.response.data.code === 'INVALID_NEXT_YEAR_VACATION_DAYS_REQUEST') {
      notificationErrorMessage = {
        400: {
          title: i18n.t('vacation.error_max_vacation_days_requested_next_year_title'),
          description: i18n.t('vacation.error_max_vacation_days_requested_next_year_message')
        }
      }
    }
  }

  return notificationErrorMessage
}
