import i18n from 'shared/i18n/i18n'
import { NotificationMessage } from 'shared/notification/notification-message'
import { injectable } from 'tsyringe'
import { getDurationByHours } from '../../utils/getDuration'
import { ActivityCodeErrors } from '../activity-code-errors'
import { MaxRegistrableHoursLimitExceeded } from '../max-registrable-hours-limit-exceeded'

type ActivityCodeError = keyof typeof ActivityCodeErrors

const ActivityErrorTitles: Record<ActivityCodeError, string> = {
  ACTIVITY_BEFORE_HIRING_DATE: 'activity_api_errors.activity_before_hiring_date_title',
  ACTIVITY_TIME_OVERLAPS: 'activity_api_errors.time_overlaps_title',
  ACTIVITY_PERIOD_CLOSED: 'activity_api_errors.activity_closed_period_title',
  CLOSED_PROJECT: 'activity_api_errors.closed_project_title',
  MAX_REGISTRABLE_HOURS_LIMIT_EXCEEDED: 'activity_api_errors.max_registrable_hours_limit_title',
  INVALID_ACTIVITY_APPROVAL_STATE: 'activity_api_errors.invalid_activity_approval_state_title',
  BLOCKED_PROJECT: 'activity_api_errors.blocked_project'
}

const ActivityErrorDescriptions: Record<ActivityCodeError, string> = {
  ACTIVITY_BEFORE_HIRING_DATE: 'activity_api_errors.activity_before_hiring_date_description',
  ACTIVITY_TIME_OVERLAPS: 'activity_api_errors.time_overlaps_description',
  ACTIVITY_PERIOD_CLOSED: 'activity_api_errors.activity_closed_period_description',
  CLOSED_PROJECT: 'activity_api_errors.closed_project_description',
  MAX_REGISTRABLE_HOURS_LIMIT_EXCEEDED:
    'activity_api_errors.max_registrable_hours_limit_description',
  INVALID_ACTIVITY_APPROVAL_STATE:
    'activity_api_errors.invalid_activity_approval_state_description',
  BLOCKED_PROJECT: 'activity_api_errors.blocked_project_description'
}

@injectable()
export class ActivityErrorMessage {
  get(code: string, data?: unknown): NotificationMessage {
    if (code === ActivityCodeErrors.MAX_REGISTRABLE_HOURS_LIMIT_EXCEEDED) {
      const { maxAllowedHours, remainingHours } = data as MaxRegistrableHoursLimitExceeded
      return {
        title: i18n.t(ActivityErrorTitles.MAX_REGISTRABLE_HOURS_LIMIT_EXCEEDED),
        description: i18n.t(ActivityErrorDescriptions.MAX_REGISTRABLE_HOURS_LIMIT_EXCEEDED, {
          maxAllowedHours: getDurationByHours(maxAllowedHours, false),
          remainingHours: getDurationByHours(remainingHours, false)
        })
      }
    }

    return {
      title: i18n.t(
        ActivityErrorTitles[code as ActivityCodeError] || 'activity_api_errors.unknown_error_title'
      ),
      description: i18n.t(
        ActivityErrorDescriptions[code as ActivityCodeError] ||
          'activity_api_errors.unknown_error_description'
      )
    }
  }
}
