import getMessageByHttpStatusCode from 'core/features/Notifications/HttpStatusCodeMessage'

jest.mock('../../../i18n', () => ({
  t: (k: string) => k
}))

const mockPromiseError = (
  status?: number,
  name: string | undefined = undefined
) => ({
  name: name,
  response: status ? { status: status } : undefined
})

test.each`
  status       | title                        | description
  ${401}       | ${'api_errors.unauthorized'} | ${'api_errors.unauthorized_description'}
  ${403}       | ${'api_errors.forbidden'}    | ${'api_errors.forbidden_description'}
  ${404}       | ${'api_errors.not_found'}    | ${'api_errors.general_description'}
  ${408}       | ${'api_errors.timeout'}      | ${'api_errors.general_description'}
  ${500}       | ${'api_errors.server_error'} | ${'api_errors.general_description'}
  ${503}       | ${'api_errors.server_down'}  | ${'api_errors.general_description'}
  ${'unknown'} | ${'api_errors.unknown'}      | ${'api_errors.general_description'}
`(
  'when status is $status returns a message with title $title and description $description',
  ({ status, title, description }) => {
    expect(getMessageByHttpStatusCode(mockPromiseError(status))).toEqual({
      title: title,
      description: description
    })
  }
)

test('should override the 401 error message', function() {
  const customErrorMessage = {
    401: {
      title: '401 error title replaced',
      description: '401 error replaced '
    }
  }
  expect(getMessageByHttpStatusCode(mockPromiseError(401), customErrorMessage)).toBe(
    customErrorMessage['401']
  )
})
