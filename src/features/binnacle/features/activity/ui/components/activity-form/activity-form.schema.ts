import { ProjectRole } from 'features/binnacle/features/project-role/domain/project-role'
import { LiteProject } from 'features/binnacle/features/project/domain/lite-project'
import { LiteOrganization } from 'features/binnacle/features/search/domain/lite-organization'
import i18n from 'shared/i18n/i18n'
import chrono, { parse } from 'shared/utils/chrono'
import { boolean, object, string } from 'yup'

export interface ActivityFormSchema {
  start: string
  end: string
  billable: boolean
  description: string
  organization?: LiteOrganization
  project?: LiteProject
  projectRole?: ProjectRole
}

const MAX_DESCRIPTION_LENGTH = 2048

const validTimeFormat = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/

export const ActivityFormValidationSchema: any = object({
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
  organization: object().nullable(),
  project: object().nullable(),
  projectRole: object().required(i18n.t('form_errors.field_required'))
}).defined()
