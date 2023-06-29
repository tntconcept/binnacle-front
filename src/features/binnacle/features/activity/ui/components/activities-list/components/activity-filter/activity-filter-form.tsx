import { FC, useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Box, Stack } from '@chakra-ui/react'
import DateField from '../../../../../../../../../shared/components/FormFields/DateField'
import { useTranslation } from 'react-i18next'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import {
  ActivityFilterFormSchema,
  ActivityFilterFormValidationSchema
} from './activity-filter-form.schema'
import chrono from '../../../../../../../../../shared/utils/chrono'

interface ActivityDateFilterProps {
  filters: { start: Date; end: Date }
  onFiltersChange: (startDate: Date, endDate: Date) => Promise<void>
}

export const ActivityFilterForm: FC<ActivityDateFilterProps> = (props) => {
  const { filters, onFiltersChange } = props
  const { t } = useTranslation()

  const {
    register,
    control,
    trigger,
    formState: { errors, isValid }
  } = useForm<ActivityFilterFormSchema>({
    defaultValues: {
      startDate: chrono(filters.start).format(chrono.DATE_FORMAT),
      endDate: chrono(filters.end).format(chrono.DATE_FORMAT)
    },
    resolver: yupResolver(ActivityFilterFormValidationSchema),
    mode: 'onChange'
  })

  const [startDate, endDate] = useWatch({
    control,
    name: ['startDate', 'endDate']
  })

  useEffect(() => {
    startDate && endDate && trigger(['startDate', 'endDate'])
    isValid && onFiltersChange(chrono(startDate).getDate(), chrono(endDate).getDate())
  }, [isValid, startDate, endDate])

  return (
    <Stack direction={['column', 'row']} spacing={4} marginBottom={5} marginTop={4}>
      <Box gridArea="start">
        <DateField
          error={errors.startDate?.message}
          label={t('activity_form.start_date')}
          {...register('startDate')}
        />
      </Box>
      <Box gridArea="end">
        <DateField
          error={errors.endDate?.message}
          label={t('activity_form.end_date')}
          {...register('endDate')}
        />
      </Box>
    </Stack>
  )
}
