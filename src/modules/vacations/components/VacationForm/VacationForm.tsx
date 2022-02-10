import { VStack } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { vacationFormSchema } from 'modules/vacations/components/VacationForm/vacation-form-schema'
import WorkingDays from 'modules/vacations/components/VacationForm/WorkingDays'
import type { VacationFormValues } from 'modules/vacations/data-access/interfaces/vacation-form-values.interface'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import DateField from 'shared/components/FormFields/DateField'
import TextAreaField from 'shared/components/FormFields/TextAreaField'
import chrono, { parseISO } from 'shared/utils/chrono';

interface Props {
  values: VacationFormValues
  createVacationPeriod: (value: VacationFormValues) => Promise<void>
  updateVacationPeriod: (value: VacationFormValues & { id: number }) => Promise<void>
}

enum DateIs {
  AFTER = 'AFTER',
  BEFORE = 'BEFORE',
  SAME = 'SAME'
}

const EndDateIs = (startDate: string, endDate: string): DateIs => {
  return chrono(endDate).isAfter(parseISO(startDate)) ? DateIs.AFTER : chrono(endDate).isBefore(parseISO(startDate)) ? DateIs.BEFORE : DateIs.SAME
}

export function VacationForm(props: Props) {
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors, isValid }
  } = useForm<VacationFormValues>({
    defaultValues: {
      id: props.values.id,
      startDate: props.values.startDate,
      endDate: props.values.endDate,
      description: props.values.description
    },
    resolver: yupResolver(vacationFormSchema),
    mode: 'onBlur'
  })

  const onSubmit = handleSubmit(async (data) => {
    if (data.id !== undefined) {
      await props.updateVacationPeriod(data as VacationFormValues & { id: number })
    } else {
      await props.createVacationPeriod(data)
    }
  })

  const endDateIs = EndDateIs(getValues('startDate'), getValues('endDate'))
  if (!isValid && endDateIs === DateIs.BEFORE) {
    setValue('endDate', getValues('startDate'), {shouldDirty: true, shouldTouch: true, shouldValidate: true})
  }

  const maxDate = chrono()
    .plus(1, 'year')
    .endOf('year')
    .format('yyyy-MM-dd')

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
