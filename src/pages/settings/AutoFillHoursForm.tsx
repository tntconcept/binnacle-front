import React, { memo, useEffect } from 'react'
import { areIntervalsOverlapping } from 'core/services/Chrono'
import { useTranslation } from 'react-i18next'
import { Box, FormControl, SimpleGrid, Stack, Text, useColorModeValue } from '@chakra-ui/core'
import { useFormik } from 'formik'
import { FloatingLabelInput } from 'core/components/FloatingLabelInput'
import { timeToDate } from 'core/utils/helpers'

interface Props {
  initialValues: string[]
  onSave: (field: string, value: any, shouldValidate: boolean) => void
}

const AutofillHoursForm: React.FC<Props> = ({ initialValues, onSave }) => {
  const { t } = useTranslation()

  const formik = useFormik({
    initialValues: {
      startWorkingTime: initialValues[0] || '09:00',
      startLunchBreak: initialValues[1] || '13:00',
      endLunchBreak: initialValues[2] || '14:00',
      endWorkingTime: initialValues[3] || '18:00'
    },
    onSubmit: (values) =>
      onSave(
        'hoursInterval',
        [
          values.startWorkingTime,
          values.startLunchBreak,
          values.endLunchBreak,
          values.endWorkingTime
        ],
        false
      ),
    validate: (values) => {
      let error = false

      try {
        error = areIntervalsOverlapping(
          {
            start: timeToDate(values.startWorkingTime),
            end: timeToDate(values.startLunchBreak)
          },
          {
            start: timeToDate(values.endLunchBreak),
            end: timeToDate(values.endWorkingTime)
          }
        )
      } catch (e) {
        error = true
      }

      // We use this property as workaround to show the invalid state
      return error ? { startWorkingTime: 'Hours overlap' } : {}
    }
  })

  useEffect(() => {
    formik.submitForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.submitForm, formik.values])

  const labelBg = useColorModeValue('white', 'gray.800')

  return (
    <Box margin={2}>
      <Stack direction="column" role="group" aria-labelledby="autofill_form_title" spacing={4}>
        <Text id="autofill_form_title">{t('settings.working_time')}</Text>
        <SimpleGrid columns={2} maxWidth="400px" spacing={4}>
          <FormControl>
            <FloatingLabelInput
              label={t('settings.start')}
              labelBgColor={labelBg}
              name="startWorkingTime"
              type="time"
              step="900"
              min="00:00"
              max="23:59"
              value={formik.values.startWorkingTime}
              onChange={formik.handleChange}
            />
          </FormControl>
          <FormControl>
            <FloatingLabelInput
              label={t('settings.end')}
              labelBgColor={labelBg}
              name="endWorkingTime"
              type="time"
              step="900"
              min="00:00"
              max="23:59"
              value={formik.values.endWorkingTime}
              onChange={formik.handleChange}
            />
          </FormControl>
        </SimpleGrid>
        <Text>{t('settings.lunch_break')}</Text>
        <SimpleGrid columns={2} maxWidth="400px" spacing={4}>
          <FormControl>
            <FloatingLabelInput
              label={t('settings.from')}
              labelBgColor={labelBg}
              name="startLunchBreak"
              type="time"
              step="900"
              min="00:00"
              max="23:59"
              value={formik.values.startLunchBreak}
              onChange={formik.handleChange}
            />
          </FormControl>
          <FormControl>
            <FloatingLabelInput
              label={t('settings.to')}
              labelBgColor={labelBg}
              name="endLunchBreak"
              type="time"
              step="900"
              min="00:00"
              max="23:59"
              value={formik.values.endLunchBreak}
              onChange={formik.handleChange}
            />
          </FormControl>
        </SimpleGrid>
      </Stack>
      {formik.errors.startWorkingTime && (
        <Text aria-live="polite" color="red.500" mt={2}>
          {t('settings.intervals_overlap')}
        </Text>
      )}
    </Box>
  )
}

export default memo(AutofillHoursForm)
