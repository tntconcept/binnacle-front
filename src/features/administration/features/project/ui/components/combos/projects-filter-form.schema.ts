import { Organization } from '../../../../../../binnacle/features/organization/domain/organization'
import { i18n } from '../../../../../../../shared/i18n/i18n'
import { object, ObjectSchema } from 'yup'
import { ProjectStatus } from '../../../domain/project-status'

export interface ProjectsFilterFormSchema {
  organization?: Organization
  status?: ProjectStatus
}

export const ProjectsFilterFormValidationSchema: ObjectSchema<ProjectsFilterFormSchema> = object({
  organization: object().required(
    i18n.t('form_errors.select_an_option')
  ) as ObjectSchema<Organization>,
  status: object().required(i18n.t('form_errors.select_an_option')) as ObjectSchema<ProjectStatus>
}).defined()
