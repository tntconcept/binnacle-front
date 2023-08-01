import { useColorMode } from '@chakra-ui/react'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageWithTitle } from '../../../../../../shared/components/page-with-title/page-with-title'
import { useResolve } from '../../../../../../shared/di/use-resolve'
import { GetUserSettingsQry } from '../application/get-user-settings-qry'
import { SaveUserSettingsCmd } from '../application/save-user-settings-cmd'
import { UserSettings } from '../domain/user-settings'
import { SettingsForm } from './components/settings-form/settings-form'

const SettingsPage: FC = () => {
  const { t, i18n } = useTranslation()
  const getUserSettingsQry = useResolve(GetUserSettingsQry)
  const saveUserSettingsCmd = useResolve(SaveUserSettingsCmd)
  const [settings, setSettings] = useState<UserSettings>()

  const changeLanguage = (lng: string) => i18n.changeLanguage(lng)

  const { colorMode, setColorMode } = useColorMode()

  useEffect(() => {
    getUserSettingsQry.internalExecute().then(setSettings)
  }, [getUserSettingsQry])

  return (
    <PageWithTitle title={t('pages.settings')}>
      {settings && (
        <SettingsForm
          language={i18n.language}
          changeLanguage={changeLanguage}
          theme={colorMode}
          changeTheme={setColorMode}
          settings={settings}
          changeSettings={(newSettings) => {
            saveUserSettingsCmd.execute(newSettings)
          }}
        />
      )}{' '}
    </PageWithTitle>
  )
}

export default SettingsPage
