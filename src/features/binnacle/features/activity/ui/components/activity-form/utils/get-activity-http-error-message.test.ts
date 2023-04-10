import { CodeErrors } from 'shared/types/error-codes'
import { getActivityHttpErrorMessage } from './get-activity-http-error-message'

describe('GetActivityErrorMessage', () => {
  test.each`
    codeError                                          | status | title                                                      | description
    ${CodeErrors.ACTIVITY_TIME_OVERLAPS}               | ${400} | ${'activity_api_errors.time_overlaps_title'}               | ${'activity_api_errors.time_overlaps_description'}
    ${CodeErrors.CLOSED_PROJECT}                       | ${400} | ${'activity_api_errors.closed_project_title'}              | ${'activity_api_errors.closed_project_description'}
    ${CodeErrors.ACTIVITY_PERIOD_CLOSED}               | ${400} | ${'activity_api_errors.activity_closed_period_title'}      | ${'activity_api_errors.activity_closed_period_description'}
    ${CodeErrors.ACTIVITY_BEFORE_HIRING_DATE}          | ${400} | ${'activity_api_errors.activity_before_hiring_date_title'} | ${'activity_api_errors.activity_before_hiring_date_description'}
    ${CodeErrors.MAX_REGISTRABLE_HOURS_LIMIT_EXCEEDED} | ${400} | ${'activity_api_errors.max_registrable_hours_limit_title'} | ${'activity_api_errors.max_registrable_hours_limit_description'}
  `(
    'when code error is $codeError should return an error with status $status, title $title and description $description',
    ({ codeError, status, title, description }) => {
      const error = {
        response: {
          status: 400,
          data: {
            code: codeError,
            data: {}
          }
        }
      }
      expect(getActivityHttpErrorMessage(error)).toEqual({
        [status]: {
          title,
          description
        }
      })
    }
  )
})
