import { Box, Heading, useColorMode } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageTitle } from 'shared/components/PageTitle'
import { useResolve } from 'shared/di/use-resolve'
import { GetUserSettingsQry } from '../application/get-user-settings-qry'
import { SaveUserSettingsCmd } from '../application/save-user-settings-cmd'
import { UserSettings } from '../domain/user-settings'
import { SettingsForm } from './components/settings-form/settings-form'

function SettingsPage() {
  const { t, i18n } = useTranslation()
  const getUserSettingsQry = useResolve(GetUserSettingsQry)
  const saveUserSettingsCmd = useResolve(SaveUserSettingsCmd)
  const [settings, setSettings] = useState<UserSettings>()

  const changeLanguage = (lng: string) => i18n.changeLanguage(lng)

  const { colorMode, setColorMode } = useColorMode()

  useEffect(() => {
    getUserSettingsQry.execute().then(setSettings)
  }, [])

  return (
    <PageTitle title={t('pages.settings')}>
      <Box mx={[5, 24]} my={[6, 10]} pb={[0, 10]}>
        <Heading mb={6}>{t('settings.my_settings')}</Heading>
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
      </Box>
    </PageTitle>
  )
}

export default SettingsPage
