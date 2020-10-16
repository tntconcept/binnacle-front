import React from 'react'
import { Flex } from '@chakra-ui/core'
import i18next from 'i18next'
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

  return (
    <Formik initialValues={initialValues} onSubmit={(values) => saveSettings(values)}>
      {(formik) => (
        <Flex as="form" data-testid="settings-form" direction="column" margin={4}>
          <AutoSave />
          <LanguageSwitcher changeLanguage={props.changeLanguage} />
          <Field name="autofillHours">
            {({ field }: FieldProps) => (
              <label htmlFor="autofillHours">
                <input type="checkbox" id="autofillHours" {...field} defaultChecked={field.value} />
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
                  <input
                    type="checkbox"
                    id="showDescription"
                    {...field}
                    defaultChecked={field.value}
                  />
                  {' ' + t('settings.description_preview')}
                </label>
              )}
            </Field>
          )}
          <Field name="showDurationInput">
            {({ field }: FieldProps) => (
              <label htmlFor="showDurationInput">
                <input
                  type="checkbox"
                  id="showDurationInput"
                  {...field}
                  defaultChecked={field.value}
                />
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
                  defaultChecked={field.value}
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

  React.useEffect(() => {
    submitForm()
  }, [submitForm, values])

  return null
}
