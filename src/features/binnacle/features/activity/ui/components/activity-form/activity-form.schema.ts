import { Organization } from '../../../../organization/domain/organization'
import { NonHydratedProjectRole } from '../../../../project-role/domain/non-hydrated-project-role'
import { ProjectRole } from '../../../../project-role/domain/project-role'
import { Project } from '../../../../project/domain/project'
import { i18n } from '../../../../../../../shared/i18n/i18n'
import { chrono, parse } from '../../../../../../../shared/utils/chrono'
import * as yup from 'yup'

export interface ActivityFormSchema {
  showRecentRole: boolean
  startTime: string
  endTime: string
  startDate: string
  endDate: string
  billable: boolean
  description: string
  organization?: Organization
  project?: Project & { organizationId: number }
  projectRole?: NonHydratedProjectRole
  recentProjectRole?: ProjectRole
  file?: File
}

const MAX_DESCRIPTION_LENGTH = 2048

const validTimeFormat = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/

export const ActivityFormValidationSchema: yup.ObjectSchema<ActivityFormSchema> = yup
  .object({
    showRecentRole: yup.boolean().required().default(false),
    file: yup.mixed(),
    startTime: yup
      .string()
      .required(i18n.t('form_errors.field_required'))
      .matches(validTimeFormat)
      .defined(),
    endTime: yup
      .string()
      .required(i18n.t('form_errors.field_required'))
      .test('is-greater', i18n.t('form_errors.end_time_greater'), function () {
        const { startTime, endTime } = this.parent
        const date = new Date()
        const startDate = parse(startTime, chrono.TIME_FORMAT, date)
        const endDate = parse(endTime, chrono.TIME_FORMAT, date)

        return chrono(endDate).isSame(startDate, 'minute') || chrono(endDate).isAfter(startDate)
      })
      .defined(),
    startDate: yup.string().required(i18n.t('form_errors.field_required')),
    endDate: yup
      .string()
      .required(i18n.t('form_errors.field_required'))
      .test('is-greater', i18n.t('form_errors.end_date_greater'), function () {
        const { startDate, endDate } = this.parent

        return chrono(endDate).isSame(startDate, 'day') || chrono(endDate).isAfter(startDate)
      }),
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
    }) as yup.ObjectSchema<Project & { organizationId: number }>,
    projectRole: yup.object().when('showRecentRole', {
      is: true,
      then: (schema) => schema.nullable(),
      otherwise: (schema) => schema.required(i18n.t('form_errors.select_an_option'))
    }) as yup.ObjectSchema<NonHydratedProjectRole>,
    recentProjectRole: yup.object().when('showRecentRole', {
      is: false,
      then: (schema) => schema.nullable(),
      otherwise: (schema) => schema.required(i18n.t('form_errors.select_an_option'))
    }) as yup.ObjectSchema<ProjectRole>
  })
  .defined()
