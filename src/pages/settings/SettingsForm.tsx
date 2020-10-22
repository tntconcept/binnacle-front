import React, { useEffect } from 'react'
import { Flex, useColorMode } from '@chakra-ui/core'
import AutofillHoursForm from 'pages/settings/AutoFillHoursForm'
import { useIsMobile } from 'core/hooks'
import { useTranslation } from 'react-i18next'
import { Field, FieldProps, Formik, useFormikContext } from 'formik'
import { LanguageSwitcher } from './LanguageSwitcher'
import { saveSettings, useSettings } from 'pages/settings/Settings.utils'

interface Props {
  changeLanguage: (lng: string) => void
}

export const SettingsForm: React.FC<Props> = (props) => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const initialValues = useSettings()
  const { toggleColorMode } = useColorMode()

  return (
    <Formik initialValues={initialValues} onSubmit={(values) => saveSettings(values)}>
      {(formik) => (
        <Flex as="form" data-testid="settings-form" direction="column" margin={4}>
          <AutoSave />
          <LanguageSwitcher changeLanguage={props.changeLanguage} />
          <Field name="darkMode">
            {({ field }: FieldProps) => (
              <label htmlFor="darkMode">
                <input
                  type="checkbox"
                  id="darkMode"
                  {...field}
                  onChange={(event) => {
                    toggleColorMode()
                    field.onChange(event)
                  }}
                  checked={field.value}
                />
                {' ' + t('settings.dark_mode')}
              </label>
            )}
          </Field>
          <Field name="autofillHours">
            {({ field }: FieldProps) => (
              <label htmlFor="autofillHours">
                <input type="checkbox" id="autofillHours" {...field} checked={field.value} />
                {' ' + t('settings.autofill_hours')}
              </label>
            )}
          </Field>
          {formik.values.autofillHours && (
            <AutofillHoursForm
              initialValues={formik.values.hoursInterval}
              onSave={formik.setFieldValue}
            />
          )}
          {!isMobile && (
            <Field name="showDescription">
              {({ field }: FieldProps) => (
                <label htmlFor="showDescription">
                  <input type="checkbox" id="showDescription" {...field} checked={field.value} />
                  {' ' + t('settings.description_preview')}
                </label>
              )}
            </Field>
          )}
          <Field name="showDurationInput">
            {({ field }: FieldProps) => (
              <label htmlFor="showDurationInput">
                <input type="checkbox" id="showDurationInput" {...field} checked={field.value} />
                {' ' + t('settings.show_duration_input')}
              </label>
            )}
          </Field>
          <Field name="useDecimalTimeFormat">
            {({ field }: FieldProps) => (
              <label htmlFor="useDecimalTimeFormat">
                <input
                  type="checkbox"
                  id="useDecimalTimeFormat"
                  {...field}
                  checked={field.checked}
                />
                {' ' + t('settings.use_decimal_time_format')}
              </label>
            )}
          </Field>
        </Flex>
      )}
    </Formik>
  )
}

const AutoSave = () => {
  const { submitForm, values } = useFormikContext()

  useEffect(() => {
    submitForm()
  }, [submitForm, values])

  return null
}
