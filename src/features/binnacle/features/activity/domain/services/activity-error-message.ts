import { i18n } from '../../../../../../shared/i18n/i18n'
import { NotificationMessage } from '../../../../../../shared/notification/notification-message'
import { chrono, getHumanizedDuration } from '../../../../../../shared/utils/chrono'
import { injectable } from 'tsyringe'
import { ActivityCodeErrors } from '../activity-code-errors'
import { BlockedProjectPayloadError } from '../blocked-project-payload-error'
import { MaxRegistrableHoursLimitExceeded } from '../max-registrable-hours-limit-exceeded'

type ActivityCodeError = keyof typeof ActivityCodeErrors

const ActivityErrorTitles: Record<ActivityCodeError, string> = {
  ACTIVITY_BEFORE_HIRING_DATE: 'activity_api_errors.activity_before_hiring_date_title',
  ACTIVITY_TIME_OVERLAPS: 'activity_api_errors.time_overlaps_title',
  ACTIVITY_PERIOD_CLOSED: 'activity_api_errors.activity_closed_period_title',
  ACTIVITY_BEFORE_PROJECT_CREATION_DATE:
    'activity_api_errors.activity_before_project_creation_date_title',
  CLOSED_PROJECT: 'activity_api_errors.closed_project_title',
  MAX_REGISTRABLE_TIME_LIMIT_EXCEEDED: 'activity_api_errors.max_registrable_time_limit_title',
  MAX_REGISTRABLE_TIME_PER_ACTIVITY_LIMIT_EXCEEDED:
    'activity_api_errors.max_registrable_time_per_activity_limit_title',
  INVALID_ACTIVITY_APPROVAL_STATE: 'activity_api_errors.invalid_activity_approval_state_title',
  BLOCKED_PROJECT: 'activity_api_errors.blocked_project'
}

const ActivityErrorDescriptions: Record<ActivityCodeError, string> = {
  ACTIVITY_BEFORE_HIRING_DATE: 'activity_api_errors.activity_before_hiring_date_description',
  ACTIVITY_TIME_OVERLAPS: 'activity_api_errors.time_overlaps_description',
  ACTIVITY_PERIOD_CLOSED: 'activity_api_errors.activity_closed_period_description',
  ACTIVITY_BEFORE_PROJECT_CREATION_DATE:
    'activity_api_errors.activity_before_project_creation_date_description',
  CLOSED_PROJECT: 'activity_api_errors.closed_project_description',
  MAX_REGISTRABLE_TIME_LIMIT_EXCEEDED: 'activity_api_errors.max_registrable_time_limit_description',
  MAX_REGISTRABLE_TIME_PER_ACTIVITY_LIMIT_EXCEEDED:
    'activity_api_errors.max_registrable_time_per_activity_limit_description',
  INVALID_ACTIVITY_APPROVAL_STATE:
    'activity_api_errors.invalid_activity_approval_state_description',
  BLOCKED_PROJECT: 'activity_api_errors.blocked_project_description'
}

@injectable()
export class ActivityErrorMessage {
  get(code: string, data?: unknown): NotificationMessage {
    if (code === ActivityCodeErrors.MAX_REGISTRABLE_TIME_LIMIT_EXCEEDED) {
      const { maxAllowedTime, remainingTime, timeUnit } = data as MaxRegistrableHoursLimitExceeded
      return {
        title: i18n.t(ActivityErrorTitles.MAX_REGISTRABLE_TIME_LIMIT_EXCEEDED),
        description: i18n.t(ActivityErrorDescriptions.MAX_REGISTRABLE_TIME_LIMIT_EXCEEDED, {
          maxAllowedTime: getHumanizedDuration({
            duration: maxAllowedTime,
            addSign: false,
            abbreviation: true,
            timeUnit
          }),
          remainingTime: getHumanizedDuration({
            duration: remainingTime,
            addSign: false,
            abbreviation: true,
            timeUnit
          })
        })
      }
    }

    if (code === ActivityCodeErrors.MAX_REGISTRABLE_TIME_PER_ACTIVITY_LIMIT_EXCEEDED) {
      const { maxAllowedTime, timeUnit } = data as MaxRegistrableHoursLimitExceeded
      return {
        title: i18n.t(ActivityErrorTitles.MAX_REGISTRABLE_TIME_PER_ACTIVITY_LIMIT_EXCEEDED),
        description: i18n.t(
          ActivityErrorDescriptions.MAX_REGISTRABLE_TIME_PER_ACTIVITY_LIMIT_EXCEEDED,
          {
            maxAllowedTime: getHumanizedDuration({
              duration: maxAllowedTime,
              addSign: false,
              abbreviation: true,
              timeUnit
            })
          }
        )
      }
    }

    if (code === ActivityCodeErrors.BLOCKED_PROJECT) {
      const { blockedDate } = data as BlockedProjectPayloadError
      return {
        title: i18n.t(ActivityErrorTitles.BLOCKED_PROJECT),
        description: i18n.t(ActivityErrorDescriptions.BLOCKED_PROJECT, {
          blockedDate: chrono(blockedDate).format(chrono.DATE_FORMAT)
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
