import { Organization } from '../../../../organization/domain/organization'
import { NonHydratedProjectRole } from '../../../../project-role/domain/non-hydrated-project-role'
import { i18n } from '../../../../../../../shared/i18n/i18n'
import * as yup from 'yup'
import { Project } from '../../../../../../shared/project/domain/project'

export interface SubcontractedActivityFormSchema {
  startDate: string
  description: string
  organization?: Organization
  project?: Project
  projectRole?: NonHydratedProjectRole
  duration?: number
  month: string
}

const MAX_DESCRIPTION_LENGTH = 2048

export const SubcontractedActivityFormValidationSchema: yup.ObjectSchema<SubcontractedActivityFormSchema> =
  yup
    .object({
      startDate: yup.string().required(i18n.t('form_errors.field_required')),
      description: yup
        .string()
        .required(i18n.t('form_errors.field_required'))
        .max(
          MAX_DESCRIPTION_LENGTH,
          ({ value, max }) => `form_errors.max_length ${value.length} / ${max}`
        )
        .defined(),
      organization: yup.object().when({
        is: true,
        then: (schema) => schema.nullable(),
        otherwise: (schema) => schema.required(i18n.t('form_errors.select_an_option'))
      }) as yup.ObjectSchema<Organization>,
      project: yup.object().when({
        is: true,
        then: (schema) => schema.nullable(),
        otherwise: (schema) => schema.required(i18n.t('form_errors.select_an_option'))
      }) as yup.ObjectSchema<Project>,
      projectRole: yup.object().when({
        is: true,
        then: (schema) => schema.nullable(),
        otherwise: (schema) => schema.required(i18n.t('form_errors.select_an_option'))
      }) as yup.ObjectSchema<NonHydratedProjectRole>,
      duration: yup
        .number()
        .typeError(i18n.t('form_errors.field_required'))
        .moreThan(0, i18n.t('form_errors.negative_duration'))
        .max(35791394, i18n.t('form_errors.max_duration_allowed')),
      month: yup.string().required(i18n.t('form_errors.field_required'))
    })

    .defined()
