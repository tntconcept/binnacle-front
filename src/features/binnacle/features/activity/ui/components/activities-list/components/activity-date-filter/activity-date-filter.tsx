import { FC, useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Box, Stack } from '@chakra-ui/react'
import DateField from '../../../../../../../../../shared/components/FormFields/DateField'
import { useTranslation } from 'react-i18next'

export const ActivityDateFilter: FC = () => {
  const { t } = useTranslation()

  const { control, register } = useForm<{ startDate: Date; endDate: Date }>({
    defaultValues: {
      startDate: new Date(),
      endDate: new Date()
    },
    mode: 'onChange'
  })

  const [startDate, endDate] = useWatch({
    control: control,
    name: ['startDate', 'endDate']
  })

  useEffect(() => {
    console.log(startDate, endDate)
  }, [startDate, endDate])

  return (
    <Stack>
      <Box gridArea="start">
        <DateField label={t('activity_form.start_date')} {...register('startDate')} />
      </Box>
      <Box gridArea="end">
        <DateField label={t('activity_form.end_date')} {...register('endDate')} />
      </Box>
    </Stack>
  )
}
