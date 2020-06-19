import React, { Fragment } from 'react'
import { useSettings } from 'features/SettingsContext/SettingsContext'
import { Checkbox } from 'common/components'
import Navbar from 'features/Navbar/Navbar'
import { useTranslation } from 'react-i18next'
import { SettingsActions } from 'features/SettingsContext/SettingsActions'
import styles from './SettingsPage.module.css'
import AutofillHoursForm from 'pages/settings/AutofillHoursForm'
import { useIsMobile, useTitle } from 'common/hooks'

const SettingsPage = () => {
  const { t } = useTranslation()
  useTitle(t('pages.settings'))

  const isMobile = useIsMobile()

  const { state, dispatch } = useSettings()

  return (
    <Fragment>
      <Navbar />
      <div className={styles.container}>
        <Checkbox
          name="autofillHours"
          label={t('settings.autofill_hours')}
          checked={state.autofillHours}
          onChange={() => dispatch(SettingsActions.toggleAutofillHours())}
        />
        {state.autofillHours && (
          <AutofillHoursForm
            hoursInterval={state.hoursInterval}
            dispatch={dispatch}
          />
        )}
        {!isMobile && (
          <>
            <Checkbox
              name="hideSaturday"
              label={t('settings.hide_saturday')}
              checked={state.hideSaturday}
              disabled={state.hideSunday}
              onChange={() => dispatch(SettingsActions.toggleSaturdayVisibility())}
            />
            <Checkbox
              name="hideSunday"
              label={t('settings.hide_sunday')}
              checked={state.hideSunday}
              disabled={state.hideSaturday}
              onChange={() => dispatch(SettingsActions.toggleSundayVisibility())}
            />
          </>
        )}
        <Checkbox
          name="showDurationInput"
          label={t('settings.show_duration_input')}
          checked={state.showDurationInput}
          onChange={() => dispatch(SettingsActions.toggleDurationInput())}
        />
        <Checkbox
          name="useDecimalTimeFormat"
          label={t('settings.use_decimal_time_format')}
          checked={state.useDecimalTimeFormat}
          onChange={() => dispatch(SettingsActions.toggleDecimalTimeFormat())}
        />
      </div>
    </Fragment>
  )
}

export default SettingsPage
