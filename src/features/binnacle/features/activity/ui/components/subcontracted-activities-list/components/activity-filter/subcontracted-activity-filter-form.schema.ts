import { object, string } from 'yup'
import { i18n } from '../../../../../../../../../shared/i18n/i18n'
import { chrono } from '../../../../../../../../../shared/utils/chrono'

export interface SubcontractedActivityFilterFormSchema {
  startDate: string
  endDate: string
}

export const SubcontractedActivityFilterFormValidationSchema = object({
  startDate: string().required(i18n.t('form_errors.field_required')),
  endDate: string()
    .required(i18n.t('form_errors.field_required'))
    .test('is-greater', i18n.t('form_errors.end_date_greater'), function () {
      const { startDate, endDate } = this.parent

      return chrono(endDate).isSame(startDate, 'day') || chrono(endDate).isAfter(startDate)
    })
}).defined()
