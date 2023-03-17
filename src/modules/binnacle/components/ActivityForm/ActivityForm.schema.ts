import type { Organization } from 'modules/binnacle/data-access/interfaces/organization.interface'
import type { ProjectRole } from 'modules/binnacle/data-access/interfaces/project-role.interface'
import type { Project } from 'modules/binnacle/data-access/interfaces/project.interface'
import type { RecentRole } from 'modules/binnacle/data-access/interfaces/recent-role'
import i18n from 'shared/i18n/i18n'
import chrono, { parse } from 'shared/utils/chrono'
import { boolean, object, string } from 'yup'

export interface ActivityFormSchema {
  showRecentRole: boolean
  start: string
  end: string
  billable: boolean
  description: string
  organization?: Organization
  project?: Project
  role?: ProjectRole
  recentRole?: RecentRole
  imageBase64: null | string
}

const MAX_DESCRIPTION_LENGTH = 2048

const validTimeFormat = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/

export const ActivityFormValidationSchema: any = object({
  showRecentRole: boolean().required().default(false),
  start: string().required(i18n.t('form_errors.field_required')).matches(validTimeFormat).defined(),
  end: string()
    .required(i18n.t('form_errors.field_required'))
    .test('is-greater', i18n.t('form_errors.end_time_greater'), function () {
      const { startTime, endTime } = this.parent
      const pStartTime = parse(startTime, 'HH:mm', chrono.now())
      const pEndTime = parse(endTime, 'HH:mm', chrono.now())

      return chrono(pEndTime).isSame(pStartTime, 'minute') || chrono(pEndTime).isAfter(pStartTime)
    })
    .defined(),
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
  role: object().when('showRecentRole', (showRecentRole: boolean, schema: any) =>
    showRecentRole ? schema.nullable() : schema.required(i18n.t('form_errors.select_an_option'))
  ),
  recentRole: object().when('showRecentRole', (showRecentRole: boolean, schema: any) =>
    showRecentRole ? schema.required(i18n.t('form_errors.field_required')) : schema.nullable()
  ),
  imageBase64: string().nullable().defined()
}).defined()
