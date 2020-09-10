import React, { Fragment } from 'react'
import Navbar from 'core/features/Navbar/Navbar'
import { useTranslation } from 'react-i18next'
import AutofillHoursForm from 'pages/settings/AutoFillHoursForm'
import { useIsMobile, useTitle } from 'core/hooks'
import i18next from 'i18next'
import { useSettings } from 'core/components/SettingsContext'
import { SettingsActions } from 'core/components/SettingsContext.reducer'
import { Box, Checkbox, Flex, Radio, RadioGroup, Stack } from '@chakra-ui/core'

const SettingsPage = () => {
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
      <Flex direction="column" margin={4}>
        <Box as="fieldset" border="none" p="0" m="0 0 16px">
          <Box as="legend" p="0" ml="8px">
            {t('settings.language')}
          </Box>
          <RadioGroup
            name="language"
            defaultValue={i18next.language.includes('es') ? 'es' : 'en'}
          >
            <Stack direction="row">
              <Radio value="es" onChange={changeLanguage}>
                Español
              </Radio>
              <Radio value="en" onChange={changeLanguage}>
                English
              </Radio>
            </Stack>
          </RadioGroup>
        </Box>
        <Checkbox
          name="autofillHours"
          isChecked={settings.autofillHours}
          onChange={() => dispatch(SettingsActions.toggleAutofillHours())}
        >
          {t('settings.autofill_hours')}
        </Checkbox>
        {settings.autofillHours && <AutofillHoursForm />}
        {!isMobile && (
          <Checkbox
            name="showDescription"
            isChecked={settings.showDescription}
            onChange={() => dispatch(SettingsActions.toggleShowDescription())}
          >
            {t('settings.description_preview')}
          </Checkbox>
        )}
        <Checkbox
          name="showDurationInput"
          isChecked={settings.showDurationInput}
          onChange={() => dispatch(SettingsActions.toggleDurationInput())}
        >
          {t('settings.show_duration_input')}
        </Checkbox>
        <Checkbox
          name="useDecimalTimeFormat"
          isChecked={settings.useDecimalTimeFormat}
          onChange={() => dispatch(SettingsActions.toggleDecimalTimeFormat())}
        >
          {t('settings.use_decimal_time_format')}
        </Checkbox>
      </Flex>
    </Fragment>
  )
}

export default SettingsPage
