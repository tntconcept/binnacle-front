import { injectable } from 'tsyringe'
import { ProjectCodeError } from '../project-code-error'
import { NotificationMessage } from '../../../../../shared/notification/notification-message'
import { i18n } from '../../../../../shared/i18n/i18n'

type ProjectCodeError = keyof typeof ProjectCodeError

const ProjectErrorTitles: Record<ProjectCodeError, string> = {
  REQUIRED_ROLE: 'project_api_errors.required_role_title'
}

const ProjectErrorDescriptions: Record<ProjectCodeError, string> = {
  REQUIRED_ROLE: 'project_api_errors.required_role_description'
}

@injectable()
export class ProjectErrorMessage {
  get(code: string): NotificationMessage {
    return {
      title: i18n.t(
        ProjectErrorTitles[code as ProjectCodeError] || 'project_api_errors.unknown_error_title'
      ),
      description: i18n.t(
        ProjectErrorDescriptions[code as ProjectCodeError] ||
          'project_api_errors.unknown_error_description'
      )
    }
  }
}
