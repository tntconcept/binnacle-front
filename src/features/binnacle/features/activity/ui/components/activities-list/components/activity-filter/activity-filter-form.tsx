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

interface ActivityDateFilterProps {
  onFiltersChange: (startDate: string, endDate: string) => void
}

export const ActivityFilterForm: FC<ActivityDateFilterProps> = (props) => {
  const { onFiltersChange } = props
  const { t } = useTranslation()

  const {
    control,
    register,
    formState: { errors }
  } = useForm<ActivityFilterFormSchema>({
    defaultValues: {
      startDate: new Date().toDateString(),
      endDate: new Date().toDateString()
    },
    resolver: yupResolver(ActivityFilterFormValidationSchema),
    mode: 'onChange'
  })

  const [startDate, endDate] = useWatch({
    control: control,
    name: ['startDate', 'endDate']
  })

  useEffect(() => {
    onFiltersChange(startDate, endDate)
  }, [startDate, endDate])

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
