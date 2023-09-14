import { i18n } from '../../../../../../shared/i18n/i18n'
import { NotificationMessage } from '../../../../../../shared/notification/notification-message'
import { injectable } from 'tsyringe'
import { VacationCodeErrors } from '../vacation-code-errors'

type VacationCodeError = keyof typeof VacationCodeErrors

const VacationErrorTitles: Record<VacationCodeError, string> = {
  INVALID_NEXT_YEAR_VACATION_DAYS_REQUEST:
    'vacation.error_max_vacation_days_requested_next_year_title',
  VACATION_RANGE_CLOSED: 'vacation.error_vacation_range_closed_title',
  VACATION_BEFORE_HIRING_DATE: 'vacation.error_vacation_before_hiring_date_title',
  VACATION_REQUEST_OVERLAPS: 'vacation.error_vacation_request_overlaps_title',
  VACATION_REQUEST_EMPTY: 'vacation.error_vacation_request_empty_title',
  NO_MORE_DAYS_LEFT_IN_YEAR: 'vacation.error_vacation_request_no_more_days_left_title'
}

const VacationErrorDescriptions: Record<VacationCodeError, string> = {
  INVALID_NEXT_YEAR_VACATION_DAYS_REQUEST:
    'vacation.error_max_vacation_days_requested_next_year_description',
  VACATION_RANGE_CLOSED: 'vacation.error_vacation_range_closed_description',
  VACATION_BEFORE_HIRING_DATE: 'vacation.error_vacation_before_hiring_date_description',
  VACATION_REQUEST_OVERLAPS: 'vacation.error_vacation_request_overlaps_description',
  VACATION_REQUEST_EMPTY: 'vacation.error_vacation_request_empty_description',
  NO_MORE_DAYS_LEFT_IN_YEAR: 'vacation.error_vacation_request_no_more_days_left_description'
}

@injectable()
export class VacationErrorMessage {
  get(code: string): NotificationMessage {
    return {
      title: i18n.t(VacationErrorTitles[code as VacationCodeError] || ''),
      description: i18n.t(VacationErrorDescriptions[code as VacationCodeError] || '')
    }
  }
}
