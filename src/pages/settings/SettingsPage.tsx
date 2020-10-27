import React, { Fragment, useCallback } from 'react'
import Navbar from 'core/components/Navbar/Navbar'
import { useTranslation } from 'react-i18next'
import { useTitle } from 'core/hooks'
import { SettingsForm } from 'pages/settings/SettingsForm'

const SettingsPage = () => {
  const { t, i18n } = useTranslation()
  useTitle(t('pages.settings'))

  const changeLanguage = useCallback((lng) => i18n.changeLanguage(lng), [i18n])

  return (
    <Fragment>
      <Navbar />
      <SettingsForm changeLanguage={changeLanguage} />
    </Fragment>
  )
}

export default SettingsPage
