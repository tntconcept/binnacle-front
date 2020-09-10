import React, { memo, useEffect, useMemo, useState } from 'react'
import { areIntervalsOverlapping } from 'date-fns'
import { timeToDate } from 'utils/DateUtils'
import { useTranslation } from 'react-i18next'
import { useSettings } from 'core/components/SettingsContext'
import { SettingsActions } from 'core/components/SettingsContext.reducer'
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Stack,
  Text
} from '@chakra-ui/core'

const AutofillHoursForm: React.FC = () => {
  const { t } = useTranslation()
  const [settings, dispatch] = useSettings()
  const [hours, setHours] = useState({
    startWorkingTime: settings.hoursInterval[0] || '09:00',
    startLunchBreak: settings.hoursInterval[1] || '13:00',
    endLunchBreak: settings.hoursInterval[2] || '14:00',
    endWorkingTime: settings.hoursInterval[3] || '18:00'
  })

  const handleHourChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    setHours((prevState) => ({ ...prevState, [target.name]: target.value }))
  }

  const areHoursOverlapping = useMemo(() => {
    try {
      return areIntervalsOverlapping(
        {
          start: timeToDate(hours.startWorkingTime),
          end: timeToDate(hours.startLunchBreak)
        },
        {
          start: timeToDate(hours.endLunchBreak),
          end: timeToDate(hours.endWorkingTime)
        }
      )
    } catch (e) {
      return true
    }
  }, [hours])

  useEffect(() => {
    if (!areHoursOverlapping) {
      dispatch(
        SettingsActions.saveHoursInterval([
          hours.startWorkingTime,
          hours.startLunchBreak,
          hours.endLunchBreak,
          hours.endWorkingTime
        ])
      )
    }
  }, [hours, areHoursOverlapping, dispatch])

  return (
    <Box margin={4}>
      <Stack role="group" aria-labelledby="autofill_form_title">
        <Text id="autofill_form_title">{t('settings.working_time')}</Text>
        <SimpleGrid columns={2} maxWidth="400px" spacing={4}>
          <FormControl>
            <FormLabel>{t('settings.start')}</FormLabel>
            <Input
              name="startWorkingTime"
              type="time"
              step="900"
              min="00:00"
              max="23:59"
              value={hours.startWorkingTime}
              onChange={handleHourChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>{t('settings.end')}</FormLabel>
            <Input
              name="endWorkingTime"
              type="time"
              step="900"
              min="00:00"
              max="23:59"
              value={hours.endWorkingTime}
              onChange={handleHourChange}
            />
          </FormControl>
        </SimpleGrid>
        <Text>{t('settings.lunch_break')}</Text>
        <SimpleGrid columns={2} maxWidth="400px" spacing={4}>
          <FormControl>
            <FormLabel>{t('settings.from')}</FormLabel>
            <Input
              name="startLunchBreak"
              type="time"
              step="900"
              min="00:00"
              max="23:59"
              value={hours.startLunchBreak}
              onChange={handleHourChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>{t('settings.to')}</FormLabel>
            <Input
              name="endLunchBreak"
              type="time"
              step="900"
              min="00:00"
              max="23:59"
              value={hours.endLunchBreak}
              onChange={handleHourChange}
            />
          </FormControl>
        </SimpleGrid>
      </Stack>
      {areHoursOverlapping && (
        <Text aria-live="polite" color="red.500" mt={2}>
          {t('settings.intervals_overlap')}
        </Text>
      )}
    </Box>
  )
}

export default memo(AutofillHoursForm)
