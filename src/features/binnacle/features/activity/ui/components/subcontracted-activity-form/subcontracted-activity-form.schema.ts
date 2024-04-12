import { Organization } from '../../../../organization/domain/organization'
import { NonHydratedProjectRole } from '../../../../project-role/domain/non-hydrated-project-role'
import { ProjectRole } from '../../../../project-role/domain/project-role'
import { i18n } from '../../../../../../../shared/i18n/i18n'
//import { chrono } from '../../../../../../../shared/utils/chrono'
import * as yup from 'yup'
import { Project } from '../../../../../../shared/project/domain/project'

export interface SubcontractedActivityFormSchema {
  showRecentRole: boolean
  startDate: string
  billable: boolean
  description: string
  organization?: Organization
  project?: Project
  projectRole?: NonHydratedProjectRole
  recentProjectRole?: ProjectRole
  duration?: number
}

const MAX_DESCRIPTION_LENGTH = 2048

export const SubcontractedActivityFormValidationSchema: yup.ObjectSchema<SubcontractedActivityFormSchema> =
  yup
    .object({
      showRecentRole: yup.boolean().required().default(false),
      startDate: yup.string().required(i18n.t('form_errors.field_required')),
      billable: yup.boolean().required(i18n.t('form_errors.field_required')),
      description: yup
        .string()
        .required(i18n.t('form_errors.field_required'))
        .max(
          MAX_DESCRIPTION_LENGTH,
          ({ value, max }) => `form_errors.max_length ${value.length} / ${max}`
        )
        .defined(),
      organization: yup.object().when('showRecentRole', {
        is: true,
        then: (schema) => schema.nullable(),
        otherwise: (schema) => schema.required(i18n.t('form_errors.select_an_option'))
      }) as yup.ObjectSchema<Organization>,
      project: yup.object().when('showRecentRole', {
        is: true,
        then: (schema) => schema.nullable(),
        otherwise: (schema) => schema.required(i18n.t('form_errors.select_an_option'))
      }) as yup.ObjectSchema<Project>,
      projectRole: yup.object().when('showRecentRole', {
        is: true,
        then: (schema) => schema.nullable(),
        otherwise: (schema) => schema.required(i18n.t('form_errors.select_an_option'))
      }) as yup.ObjectSchema<NonHydratedProjectRole>,
      recentProjectRole: yup.object().when('showRecentRole', {
        is: true,
        then: (schema) => schema.required(i18n.t('form_errors.select_an_option')),
        otherwise: (schema) => schema.nullable()
      }) as yup.ObjectSchema<ProjectRole>,
      duration: yup
        .number()
        .typeError(i18n.t('form_errors.field_required'))
        .moreThan(0, i18n.t('form_errors.negative_duration'))
        .max(35791394, i18n.t('form_errors.max_duration_allowed'))
    })
    .defined()
