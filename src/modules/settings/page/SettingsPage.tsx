import { Box, Heading, useColorMode } from '@chakra-ui/react'
import { observer } from 'mobx-react'
import { SettingsForm } from 'modules/settings/components/SettingsForm/SettingsForm'
import { useTranslation } from 'react-i18next'
import { useGlobalState } from 'shared/arch/hooks/use-global-state'
import { PageTitle } from 'shared/components/PageTitle'
import { SettingsState } from 'shared/data-access/state/settings-state'

function SettingsPage() {
  const { t, i18n } = useTranslation()

  const changeLanguage = (lng: string) => i18n.changeLanguage(lng)

  const { colorMode, setColorMode } = useColorMode()
  const { settings, saveSettings } = useGlobalState(SettingsState)

  return (
    <PageTitle title={t('pages.settings')}>
      <Box mx={[5, 24]} my={[6, 10]} pb={[0, 10]}>
        <Heading mb={6}>{t('settings.my_settings')}</Heading>
        <SettingsForm
          language={i18n.language}
          changeLanguage={changeLanguage}
          theme={colorMode}
          changeTheme={setColorMode}
          settings={settings}
          changeSettings={saveSettings}
        />
      </Box>
    </PageTitle>
  )
}

export default observer(SettingsPage)
