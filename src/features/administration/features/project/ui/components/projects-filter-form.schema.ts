import { Organization } from 'features/binnacle/features/organization/domain/organization'
import i18n from 'shared/i18n/i18n'
import { object, string } from 'yup'
import { ProjectStatus } from '../../domain/project-status'

export interface ProjectsFilterFormSchema {
  organization?: Organization
  status?: ProjectStatus
}

export const ProjectsFilterFormValidationSchema: any = object({
  organization: string().required(i18n.t('form_errors.select_an_option')),
  status: string().optional()
}).defined()
