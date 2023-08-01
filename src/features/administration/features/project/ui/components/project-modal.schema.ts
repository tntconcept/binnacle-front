import { i18n } from '../../../../../../shared/i18n/i18n'
import { object, string } from 'yup'
import { chrono, parse } from '../../../../../../shared/utils/chrono'

export interface ProjectModalFormSchema {
  blockDate: string
}

export const ProjectModalFormValidationSchema = object({
  blockDate: string()
    .required(i18n.t('form_errors.field_required'))
    .test('is-greater', i18n.t('form_errors.date_max_today'), function () {
      const { blockDate } = this.parent
      const date = new Date()
      const blockDateParse = parse(blockDate, chrono.DATE_FORMAT, date)
      return chrono(blockDateParse).isBefore(date)
    })
    .defined()
}).defined()
