import i18n from 'shared/i18n/i18n'
import { CodeErrors } from '../../../../shared/types/error-codes'

export const getVacationErrorMessage = (error: any) => {
  let notificationErrorMessage = undefined

  if (error.response && error.response.status === 400) {
    const code = error.response.data.code

    switch (code) {
      case CodeErrors.INVALID_NEXT_YEAR_VACATION_DAYS_REQUEST:
        return (notificationErrorMessage = {
          400: {
            title: i18n.t('vacation.error_max_vacation_days_requested_next_year_title'),
            description: i18n.t('vacation.error_max_vacation_days_requested_next_year_description')
          }
        })
      case CodeErrors.VACATION_RANGE_CLOSED:
        return (notificationErrorMessage = {
          400: {
            title: i18n.t('vacation.error_vacation_range_closed_title'),
            description: i18n.t('vacation.error_vacation_range_closed_description')
          }
        })
      case CodeErrors.VACATION_BEFORE_HIRING_DATE:
        return (notificationErrorMessage = {
          400: {
            title: i18n.t('vacation.error_vacation_before_hiring_date_title'),
            description: i18n.t('vacation.error_vacation_before_hiring_date_description')
          }
        })
      case CodeErrors.VACATION_REQUEST_OVERLAPS:
        return (notificationErrorMessage = {
          400: {
            title: i18n.t('vacation.error_vacation_request_overlaps_title'),
            description: i18n.t('vacation.error_vacation_request_overlaps_description')
          }
        })
      case CodeErrors.VACATION_REQUEST_EMPTY:
        /* eslint-disable  @typescript-eslint/no-unused-vars */
        return (notificationErrorMessage = {
          400: {
            title: i18n.t('vacation.error_vacation_request_empty_title'),
            description: i18n.t('vacation.error_vacation_request_empty_description')
          }
        })
    }
  }
}
