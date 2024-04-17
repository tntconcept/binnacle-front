import { FC, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Box, Stack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  SubcontractedActivityFilterFormSchema,
  SubcontractedActivityFilterFormValidationSchema
} from './subcontracted-activity-filter-form.schema'
import { chrono } from '../../../../../../../../../shared/utils/chrono'
import { MonthField } from '../../../../../../../../../shared/components/form-fields/month-field'

interface Props {
  filters: { start: Date; end: Date }
  onFiltersChange: (startDate: Date, endDate: Date) => Promise<void>
}

export const SubcontractedActivityFilterForm: FC<Props> = (props) => {
  const { filters, onFiltersChange } = props
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors }
  } = useForm<SubcontractedActivityFilterFormSchema>({
    defaultValues: {
      // startDate: chrono(filters.start).format(chrono.DATE_FORMAT),
      // endDate: chrono(filters.end).format(chrono.DATE_FORMAT)

      startDate: chrono(filters.start).format('yyyy-MM'),
      endDate: chrono(filters.end).format('yyyy-MM')
    },
    resolver: yupResolver(SubcontractedActivityFilterFormValidationSchema),
    mode: 'onChange'
  })

  const onSubmit = useCallback(
    (data: SubcontractedActivityFilterFormSchema) => {
      onFiltersChange(chrono(data.startDate).getDate(), chrono(data.endDate).getDate())
    },
    [onFiltersChange]
  )

  useEffect(() => {
    const subscription = watch(async () => {
      const isValid = await trigger()
      if (isValid) {
        handleSubmit(onSubmit)()
      }
    })
    return () => subscription?.unsubscribe()
  }, [watch, handleSubmit, filters, trigger, onSubmit])

  return (
    <Stack as="form" direction={['column', 'row']} spacing={4} marginBottom={5} marginTop={4}>
      <Box gridArea="start">
        <MonthField
          error={errors.startDate?.message}
          label={t('activity_form.start_date')}
          {...register('startDate')}
        />
      </Box>
      <Box gridArea="end">
        <MonthField
          error={errors.endDate?.message}
          label={t('activity_form.end_date')}
          {...register('endDate')}
        />
      </Box>
    </Stack>
  )
}
