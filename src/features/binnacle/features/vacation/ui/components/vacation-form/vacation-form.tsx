import { VStack } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import DateField from 'shared/components/FormFields/DateField'
import TextAreaField from 'shared/components/FormFields/TextAreaField'
import { Serialized } from 'shared/types/serialized'
import chrono from 'shared/utils/chrono'
import { NewVacation } from '../../../domain/new-vacation'
import { UpdateVacation } from '../../../domain/update-vacation'
import { vacationFormSchema } from './vacation-form-schema'
import WorkingDays from './working-days'

interface Props {
  values: NewVacation | UpdateVacation
  createVacationPeriod: (value: NewVacation | UpdateVacation) => Promise<void>
  updateVacationPeriod: (value: UpdateVacation) => Promise<void>
}

export function VacationForm(props: Props) {
  const { t } = useTranslation()
  const startDateString = chrono(props.values.startDate).format('yyyy-MM-dd')
  const endDateString = chrono(props.values.endDate).format('yyyy-MM-dd')

  const oldStartDate = useRef(startDateString)
  const oldEndDate = useRef(endDateString)

  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors, isValid },
    clearErrors
  } = useForm<Serialized<NewVacation | UpdateVacation>>({
    defaultValues: {
      id: (props.values as UpdateVacation).id,
      startDate: startDateString,
      endDate: endDateString,
      description: props.values.description
    },
    resolver: yupResolver(vacationFormSchema),
    mode: 'onBlur'
  })

  const onSubmit = handleSubmit(async (data) => {
    const vacation = {
      ...data,
      startDate: chrono(data.startDate).getDate(),
      endDate: chrono(data.endDate).getDate()
    }

    if ('id' in data && data.id !== undefined) {
      await props.updateVacationPeriod(vacation as UpdateVacation)
    } else {
      await props.createVacationPeriod(vacation as NewVacation)
    }
  })

  useEffect(() => {
    const isEndDateBeforeStartDate = chrono(getValues('endDate')).isBefore(
      chrono(getValues('startDate')).getDate()
    )
    if (!isValid && isEndDateBeforeStartDate) {
      const startDateChanges = oldStartDate.current !== getValues('startDate')
      if (startDateChanges) {
        oldStartDate.current = getValues('startDate')
        setValue('endDate', getValues('startDate'), {
          shouldValidate: true
        })
      }

      const endDateChanges = oldEndDate.current !== getValues('endDate')
      if (endDateChanges) {
        oldEndDate.current = getValues('endDate')
        clearErrors('endDate')
        setValue('startDate', getValues('endDate'), {
          shouldValidate: true
        })
      }
    }
  })

  const maxDate = chrono().plus(1, 'year').endOf('year').format('yyyy-MM-dd')

  return (
    <VStack
      as="form"
      id="vacation-form"
      data-testid="vacation-form"
      spacing={5}
      align="start"
      onSubmit={onSubmit}
    >
      <DateField
        label={t('vacation_form.start_date')}
        max={maxDate}
        error={errors.startDate?.message}
        {...register('startDate')}
      />
      <DateField
        label={t('vacation_form.end_date')}
        max={maxDate}
        error={errors.endDate?.message}
        {...register('endDate')}
      />
      <WorkingDays control={control} />
      <TextAreaField
        label={t('vacation_form.description')}
        height="128px"
        error={errors.description?.message}
        {...register('description')}
        labelBgColorDarkTheme="gray.700"
      />
    </VStack>
  )
}
