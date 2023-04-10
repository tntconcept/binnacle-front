import { Box, Flex, FormLabel, Select, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import type { ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { TimeField } from 'shared/components/FormFields/TimeField'
import { useIsMobile } from 'shared/hooks'
import { areIntervalsOverlapping } from 'shared/utils/chrono'
import { timeToDate } from 'shared/utils/helpers'
import { observer } from 'mobx-react'
import { useAutoSave } from './useAutoSave'
import { SwitchField } from 'shared/components/switch-field/switch-field'
import { UserSettings } from '../../../domain/user-settings'

interface Props {
  language: string
  changeLanguage: (lng: string) => void
  theme: 'light' | 'dark' | 'system'
  changeTheme: (theme: string) => void
  settings: UserSettings
  changeSettings: (settings: UserSettings) => void
}

export const SettingsForm = observer((props: Props) => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()

  const { register, watch, setValue } = useForm<UserSettings>({
    defaultValues: { ...props.settings }
  })

  const hoursInterval = watch('hoursInterval')
  const checkHoursInterval = () => {
    try {
      return areIntervalsOverlapping(
        {
          start: timeToDate(hoursInterval.startWorkingTime),
          end: timeToDate(hoursInterval.startLunchBreak)
        },
        {
          start: timeToDate(hoursInterval.endLunchBreak),
          end: timeToDate(hoursInterval.endWorkingTime)
        }
      )
    } catch (e) {
      return true
    }
  }

  const hasHoursIntervalError = checkHoursInterval()
  const values = watch()
  useAutoSave(values, props.changeSettings, hasHoursIntervalError)

  const handleChangeTheme = (event: ChangeEvent<HTMLSelectElement>) => {
    const newTheme = event.target.value as Props['theme']
    if (newTheme === 'system') {
      setValue('isSystemTheme', true)
      const mql = window.matchMedia('(prefers-color-scheme: dark)')
      const systemPreference = mql.matches ? 'dark' : 'light'
      props.changeTheme(systemPreference)
    } else {
      setValue('isSystemTheme', false)
      props.changeTheme(newTheme)
    }
  }

  const initialLanguage = props.language.toLocaleLowerCase().includes('en') ? 'en' : 'es'
  const initialTheme = props.settings.isSystemTheme ? 'system' : props.theme

  const fieldBgColor = useColorModeValue('white', undefined)

  return (
    <Flex direction={['column', 'row']} data-testid="settings-form" gridGap="24px">
      <Stack spacing={3}>
        <Box>
          <Text fontSize="2xl">{t('settings.global_section')}</Text>
          <FormLabel htmlFor="language" mt="2">
            {t('settings.language')}
          </FormLabel>
          <Select
            id="language"
            defaultValue={initialLanguage}
            onChange={(event) => props.changeLanguage(event.target.value)}
            bgColor={fieldBgColor}
          >
            <option value="en">{t('settings.en')}</option>
            <option value="es">{t('settings.es')}</option>
          </Select>
        </Box>
        <Box>
          <FormLabel htmlFor="theme">{t('settings.theme')}</FormLabel>
          <Select
            id="theme"
            defaultValue={initialTheme}
            onChange={handleChangeTheme}
            bgColor={fieldBgColor}
          >
            <option value="light">{t('settings.light_theme')}</option>
            <option value="dark">{t('settings.dark_theme')}</option>
            <option value="system">{t('settings.system_theme')}</option>
          </Select>
        </Box>
        <SwitchField
          label={t('settings.use_decimal_time_format')}
          {...register('useDecimalTimeFormat')}
        />
      </Stack>
      <Stack spacing={3}>
        <Text fontSize="2xl">{t('settings.activity_section')}</Text>
        <SwitchField label={t('settings.autofill_hours')} {...register('autofillHours')} />
        {values.autofillHours && (
          <Box margin={2}>
            <Stack
              direction="column"
              role="group"
              aria-labelledby="autofill_form_title"
              spacing={4}
            >
              <Text id="autofill_form_title">{t('settings.working_time')}</Text>
              <Flex align="center" sx={{ gap: 10 }}>
                <TimeField
                  label={t('settings.start')}
                  inputBgColor={fieldBgColor}
                  {...register('hoursInterval.startWorkingTime')}
                />
                -
                <TimeField
                  label={t('settings.end')}
                  inputBgColor={fieldBgColor}
                  {...register('hoursInterval.endWorkingTime')}
                />
              </Flex>
              <Text>{t('settings.lunch_break')}</Text>
              <Flex align="center" sx={{ gap: 10 }}>
                <TimeField
                  label={t('settings.from')}
                  inputBgColor={fieldBgColor}
                  {...register('hoursInterval.startLunchBreak')}
                />
                -
                <TimeField
                  label={t('settings.to')}
                  inputBgColor={fieldBgColor}
                  {...register('hoursInterval.endLunchBreak')}
                />
              </Flex>
            </Stack>
            {hasHoursIntervalError && (
              <Text aria-live="polite" color="red.500" mt={2}>
                {t('settings.intervals_overlap')}
              </Text>
            )}
          </Box>
        )}
        {!isMobile && (
          <SwitchField label={t('settings.description_preview')} {...register('showDescription')} />
        )}
      </Stack>
    </Flex>
  )
})
