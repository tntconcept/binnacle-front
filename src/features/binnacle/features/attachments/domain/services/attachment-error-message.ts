import { NotificationMessage } from '../../../../../../shared/notification/notification-message'
import { i18n } from '../../../../../../shared/i18n/i18n'
import { AttachmentCodeErrors } from '../attachment-code-errors'

type AttachmentCodeError = keyof typeof AttachmentCodeErrors

const AttachmentErrorTitles: Record<AttachmentCodeError, string> = {
  ATTACHMENT_MIMETYPE_NOT_SUPPORTED: 'activity_api_errors.invalid_file_format_title'
}
const AttachmentErrorDescription: Record<AttachmentCodeError, string> = {
  ATTACHMENT_MIMETYPE_NOT_SUPPORTED: 'activity_api_errors.invalid_file_format_description'
}

export class AttachmentErrorMessage {
  get(code: string): NotificationMessage {
    return {
      title: i18n.t(
        AttachmentErrorTitles[code as AttachmentCodeError] ||
          'activity_api_errors.unknown_error_title'
      ),
      description: i18n.t(
        AttachmentErrorDescription[code as AttachmentCodeError] ||
          'activity_api_errors.unknown_error_description'
      )
    }
  }
}
