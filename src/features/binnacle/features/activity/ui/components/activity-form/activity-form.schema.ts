import { Organization } from 'features/binnacle/features/organization/domain/organization'
import { NonHydratedProjectRole } from 'features/binnacle/features/project-role/domain/non-hydrated-project-role'
import { ProjectRole } from 'features/binnacle/features/project-role/domain/project-role'
import { Project } from 'features/binnacle/features/project/domain/project'
import i18n from 'shared/i18n/i18n'
import chrono, { parse } from 'shared/utils/chrono'
import { boolean, object, string } from 'yup'

export interface ActivityFormSchema {
  showRecentRole: boolean
  startTime: string
  endTime: string
  startDate: string
  endDate: string
  billable: boolean
  description: string
  organization?: Organization
  project?: Project
  projectRole?: NonHydratedProjectRole | ProjectRole
  file?: string
}

const MAX_DESCRIPTION_LENGTH = 2048

const validTimeFormat = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/

export const ActivityFormValidationSchema: any = object({
  showRecentRole: boolean().required().default(false),
  startTime: string()
    .required(i18n.t('form_errors.field_required'))
    .matches(validTimeFormat)
    .defined(),
  endTime: string()
    .required(i18n.t('form_errors.field_required'))
    .test('is-greater', i18n.t('form_errors.end_time_greater'), function () {
      const { startTime, endTime } = this.parent
      const date = new Date()
      const startDate = parse(startTime, chrono.TIME_FORMAT, date)
      const endDate = parse(endTime, chrono.TIME_FORMAT, date)

      return chrono(endDate).isSame(startDate, 'minute') || chrono(endDate).isAfter(startDate)
    })
    .defined(),
  startDate: string(),
  endDate: string(),
  billable: boolean().required(i18n.t('form_errors.field_required')),
  description: string()
    .required(i18n.t('form_errors.field_required'))
    .max(
      MAX_DESCRIPTION_LENGTH,
      ({ value, max }) => `form_errors.max_length ${value.length} / ${max}`
    )
    .defined(),
  organization: object().when('showRecentRole', (showRecentRole: boolean, schema: any) =>
    showRecentRole ? schema.nullable() : schema.required(i18n.t('form_errors.select_an_option'))
  ),
  project: object().when('showRecentRole', (showRecentRole: boolean, schema: any) =>
    showRecentRole ? schema.nullable() : schema.required(i18n.t('form_errors.select_an_option'))
  ),
  projectRole: object().required(i18n.t('form_errors.select_an_option')).defined(),
  file: string().nullable().defined()
}).defined()
