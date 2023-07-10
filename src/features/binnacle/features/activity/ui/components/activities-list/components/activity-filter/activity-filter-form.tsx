import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Box, Stack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import {
  ActivityFilterFormSchema,
  ActivityFilterFormValidationSchema
} from './activity-filter-form.schema'
import { chrono } from '../../../../../../../../../shared/utils/chrono'
import { DateField } from '../../../../../../../../../shared/components/form-fields/date-field'

interface Props {
  filters: { start: Date; end: Date }
  onFiltersChange: (startDate: Date, endDate: Date) => Promise<void>
}

export const ActivityFilterForm: FC<Props> = (props) => {
  const { filters, onFiltersChange } = props
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors }
  } = useForm<ActivityFilterFormSchema>({
    defaultValues: {
      startDate: chrono(filters.start).format(chrono.DATE_FORMAT),
      endDate: chrono(filters.end).format(chrono.DATE_FORMAT)
    },
    resolver: yupResolver(ActivityFilterFormValidationSchema),
    mode: 'onChange'
  })

  const onSubmit = (data: ActivityFilterFormSchema) => {
    onFiltersChange(chrono(data.startDate).getDate(), chrono(data.endDate).getDate())
  }
  useEffect(() => {
    const subscription = watch(async () => {
      const isValid = await trigger()
      if (isValid) {
        handleSubmit(onSubmit)()
      }
    })
    return () => subscription?.unsubscribe()
  }, [watch, handleSubmit, filters])

  return (
    <Stack as="form" direction={['column', 'row']} spacing={4} marginBottom={5} marginTop={4}>
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
