import { i18n } from '../../../../../../../shared/i18n/i18n'
import { chrono } from '../../../../../../../shared/utils/chrono'
import * as yup from 'yup'
import { Serialized } from '../../../../../../../shared/types/serialized'
import { NewVacation } from '../../../domain/new-vacation'
import { UpdateVacation } from '../../../domain/update-vacation'

const maxYear = chrono().plus(2, 'year').get('year')

const validDateFormat = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/

export const vacationFormSchema: yup.ObjectSchema<Serialized<NewVacation | UpdateVacation>> = yup
  .object()
  .shape({
    id: yup.number().optional(),
    startDate: yup
      .string()
      .required(i18n.t('form_errors.field_required'))
      .matches(validDateFormat, i18n.t('form_errors.matches'))
      .test('max-year', i18n.t('form_errors.year_max') + ' ' + maxYear, function (value) {
        return chrono(value).get('year') < maxYear
      }),
    // TODO: Check if need to add back defined()
    endDate: yup
      .string()
      .required(i18n.t('form_errors.field_required'))
      .matches(validDateFormat, i18n.t('form_errors.matches'))
      .test('max-year', i18n.t('form_errors.year_max') + ' ' + maxYear, function (value) {
        return chrono(value).get('year') < maxYear
      })
      .test('is-greater', i18n.t('form_errors.end_date_greater'), function () {
        const { startDate, endDate } = this.parent

        return chrono(endDate).isSame(startDate, 'day') || chrono(endDate).isAfter(startDate)
      }),
    // TODO: Check if need to add back defined()
    description: yup
      .string()
      .default('')
      .defined()
      .max(
        1024,
        (message) => `${i18n.t('form_errors.max_length')} ${message.value.length} / ${message.max}`
      )
  })
