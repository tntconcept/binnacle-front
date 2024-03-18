import * as yup from 'yup'
import { i18n } from '../../../../../shared/i18n/i18n'

export interface LoginFormSchema {
  username: string
  password: string
}

export const loginFormSchema: yup.ObjectSchema<LoginFormSchema> = yup
  .object()
  .shape({
    username: yup.string().required(i18n.t('form_errors.field_required')),
    password: yup.string().required(i18n.t('form_errors.field_required'))
  })
  .defined()
