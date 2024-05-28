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
import { OrganizationsCombo } from '../../../activity-form/components/combos/organizations-combo'
import { GetSubcontractedActivitiesQueryParams } from '../../../../../domain/get-subcontracted-activities-query-params'

interface Props {
  filters: GetSubcontractedActivitiesQueryParams
  onFiltersChange: (params: GetSubcontractedActivitiesQueryParams) => Promise<void>
}

export const SubcontractedActivityFilterForm: FC<Props> = (props) => {
  const { filters, onFiltersChange } = props
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    control,
    trigger,
    watch,
    formState: { errors }
  } = useForm<SubcontractedActivityFilterFormSchema>({
    defaultValues: {
      startDate: chrono(filters.startDate).format('yyyy-MM'),
      endDate: chrono(filters.endDate).format('yyyy-MM'),
      organization: undefined
    },
    resolver: yupResolver(SubcontractedActivityFilterFormValidationSchema),
    mode: 'onChange'
  })

  const onSubmit = useCallback(
    (data: SubcontractedActivityFilterFormSchema) => {
      const startDate = chrono(data.startDate).startOf('month').format('yyyy-MM-dd')
      const endDate = chrono(data.endDate).endOf('month').format('yyyy-MM-dd')
      const organizationId = data.organization?.id

      onFiltersChange({
        startDate,
        endDate,
        organizationId
      })
    },
    [onFiltersChange]
  )

  useEffect(() => {
    const subscription = watch(async (newValues) => {
      const isValid = await trigger()
      if (isValid) {
        // TODO: review types here
        //@ts-ignore
        handleSubmit(() => onSubmit(newValues))()
      }
    })
    return () => subscription?.unsubscribe()
  }, [handleSubmit])

  return (
    <Stack as="form" direction={['column', 'row']} spacing={4} marginBottom={5} marginTop={4}>
      <Box>
        <OrganizationsCombo
          control={control}
          isReadOnly={false}
          organizationFilters={{ imputable: true }}
        />
      </Box>
      <Box gridArea="start">
        <MonthField
          error={errors.startDate?.message}
          label={t('subcontracted_activity_form.start_date')}
          {...register('startDate')}
        />
      </Box>
      <Box gridArea="end">
        <MonthField
          error={errors.endDate?.message}
          label={t('subcontracted_activity_form.end_date')}
          {...register('endDate')}
        />
      </Box>
    </Stack>
  )
}
