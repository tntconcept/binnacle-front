import * as Yup from 'yup'
import i18n from 'i18n'
import { isAfter, isEqual, parse } from 'date-fns'

export const ActivityFormSchema = Yup.object().shape({
  startTime: Yup.string().required(i18n.t('form_errors.field_required')),
  endTime: Yup.string()
    .required(i18n.t('form_errors.field_required'))
    .test('is-greater', i18n.t('form_errors.end_time_greater'), function(value) {
      const { startTime } = this.parent
      const currentDate = new Date()
      const startDate = parse(startTime, 'HH:mm', currentDate)
      const endDate = parse(value, 'HH:mm', currentDate)
      return isAfter(endDate, startDate) || isEqual(endDate, startDate)
    }),
  recentRole: Yup.object().required(i18n.t('form_errors.field_required')),
  billable: Yup.string().required(i18n.t('form_errors.field_required')),
  description: Yup.string()
    .required(i18n.t('form_errors.field_required'))
    .max(2048, i18n.t('form_errors.max_length'))
})

export const ActivityFormSchemaWithSelectRole = Yup.object().shape({
  startTime: Yup.string().required(i18n.t('form_errors.field_required')),
  endTime: Yup.string()
    .required(i18n.t('form_errors.field_required'))
    .test('is-greater', i18n.t('form_errors.end_time_greater'), function(value) {
      const { startTime } = this.parent
      const currentDate = new Date()
      const startDate = parse(startTime, 'HH:mm', currentDate)
      const endDate = parse(value, 'HH:mm', currentDate)
      return isAfter(endDate, startDate) || isEqual(endDate, startDate)
    }),
  organization: Yup.object().required(i18n.t('form_errors.select_an_option')),
  project: Yup.object().required(i18n.t('form_errors.select_an_option')),
  role: Yup.object().required(i18n.t('form_errors.select_an_option')),
  billable: Yup.string().required(i18n.t('form_errors.field_required')),
  description: Yup.string()
    .required(i18n.t('form_errors.field_required'))
    .max(2048, i18n.t('form_errors.max_length'))
})
