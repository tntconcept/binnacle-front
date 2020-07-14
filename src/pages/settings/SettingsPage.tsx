import React, { Fragment } from 'react'
import { Checkbox } from 'common/components'
import Navbar from 'features/Navbar/Navbar'
import { useTranslation } from 'react-i18next'
import styles from './SettingsPage.module.css'
import AutofillHoursForm from 'pages/settings/AutoFillHoursForm'
import { useIsMobile, useTitle } from 'common/hooks'
import i18next from 'i18next'
import { Radio } from 'common/components/Radio/Radio'
import { useSettings } from 'common/components/SettingsContext'
import { SettingsActions } from 'common/components/SettingsContext.reducer'

export const SettingsPage = () => {
  const { t } = useTranslation()
  useTitle(t('pages.settings'))
  const isMobile = useIsMobile()
  const [settings, dispatch] = useSettings()

  function changeLanguage(event: React.ChangeEvent<HTMLInputElement>) {
    i18next.changeLanguage(event.target.value)
  }

  return (
    <Fragment>
      <Navbar />
      <div className={styles.container}>
        <fieldset className={styles.language}>
          <legend>{t('settings.language')}</legend>
          <Radio
            name="language"
            value="es"
            onChange={changeLanguage}
            defaultChecked={i18next.language.includes('es')}
          >
            Español
          </Radio>
          <Radio
            name="language"
            value="en"
            onChange={changeLanguage}
            defaultChecked={i18next.language.includes('en')}
          >
            English
          </Radio>
        </fieldset>
        <Checkbox
          name="autofillHours"
          label={t('settings.autofill_hours')}
          checked={settings.autofillHours}
          onChange={() => dispatch(SettingsActions.toggleAutofillHours())}
        />
        {settings.autofillHours && <AutofillHoursForm />}
        {!isMobile && (
          <Checkbox
            name="showDescription"
            label={t('settings.description_preview')}
            checked={settings.showDescription}
            onChange={() => dispatch(SettingsActions.toggleShowDescription())}
          />
        )}
        <Checkbox
          name="showDurationInput"
          label={t('settings.show_duration_input')}
          checked={settings.showDurationInput}
          onChange={() => dispatch(SettingsActions.toggleDurationInput())}
        />
        <Checkbox
          name="useDecimalTimeFormat"
          label={t('settings.use_decimal_time_format')}
          checked={settings.useDecimalTimeFormat}
          onChange={() => dispatch(SettingsActions.toggleDecimalTimeFormat())}
        />
      </div>
    </Fragment>
  )
}
