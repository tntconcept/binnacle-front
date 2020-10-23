import React, { useEffect } from 'react'
import { Flex, useColorMode } from '@chakra-ui/core'
import AutofillHoursForm from 'pages/settings/AutoFillHoursForm'
import { useIsMobile } from 'core/hooks'
import { useTranslation } from 'react-i18next'
import { Field, FieldProps, Formik, useFormikContext } from 'formik'
import { LanguageSwitcher } from './LanguageSwitcher'
import { saveSettings, useSettings } from 'pages/settings/Settings.utils'
import { MyLabel } from 'core/components/MyLabel'

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
              <MyLabel htmlFor="darkMode">
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
              </MyLabel>
            )}
          </Field>
          <Field name="autofillHours">
            {({ field }: FieldProps) => (
              <MyLabel htmlFor="autofillHours">
                <input type="checkbox" id="autofillHours" {...field} checked={field.value} />
                {' ' + t('settings.autofill_hours')}
              </MyLabel>
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
                <MyLabel htmlFor="showDescription">
                  <input type="checkbox" id="showDescription" {...field} checked={field.value} />
                  {' ' + t('settings.description_preview')}
                </MyLabel>
              )}
            </Field>
          )}
          <Field name="showDurationInput">
            {({ field }: FieldProps) => (
              <MyLabel htmlFor="showDurationInput">
                <input type="checkbox" id="showDurationInput" {...field} checked={field.value} />
                {' ' + t('settings.show_duration_input')}
              </MyLabel>
            )}
          </Field>
          <Field name="useDecimalTimeFormat">
            {({ field }: FieldProps) => (
              <MyLabel htmlFor="useDecimalTimeFormat">
                <input
                  type="checkbox"
                  id="useDecimalTimeFormat"
                  {...field}
                  checked={field.checked}
                />
                {' ' + t('settings.use_decimal_time_format')}
              </MyLabel>
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
