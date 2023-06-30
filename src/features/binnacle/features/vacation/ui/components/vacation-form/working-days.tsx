import { Text } from '@chakra-ui/react'
import { FC, useEffect, useState } from 'react'
import type { Control } from 'react-hook-form'
import { useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useGetUseCase } from 'shared/arch/hooks/use-get-use-case'
import { useDebounce } from 'shared/hooks'
import { DateInterval } from 'shared/types/date-interval'
import { Serialized } from 'shared/types/serialized'
import { GetDaysForVacationPeriodQry } from '../../../application/get-days-for-vacation-period-qry'
import { NewVacation } from '../../../domain/new-vacation'
import { UpdateVacation } from '../../../domain/update-vacation'

interface Props {
  control: Control<Serialized<UpdateVacation | NewVacation>>
}

const validDateFormat = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/

const validatePeriod = (startDate: string, endDate: string): boolean => {
  return validDateFormat.test(startDate) && validDateFormat.test(endDate)
}

export const WorkingDays: FC<Props> = (props) => {
  const { t } = useTranslation()
  const [numberOfDays, setNumberOfDays] = useState<null | number>(null)
  const { isLoading, executeUseCase: getDaysForVacationPeriodQry } = useGetUseCase(
    GetDaysForVacationPeriodQry
  )

  const [startDate, endDate] = useWatch({
    control: props.control,
    name: ['startDate', 'endDate']
  })

  const debouncedStartDate = useDebounce(startDate, 500)
  const debouncedEndDate = useDebounce(endDate, 500)

  const areValid = validatePeriod(debouncedStartDate, debouncedEndDate)

  useEffect(() => {
    if (areValid) {
      const dateInterval: DateInterval = { start: debouncedStartDate, end: debouncedEndDate }
      getDaysForVacationPeriodQry(dateInterval).then(setNumberOfDays)
    } else {
      setNumberOfDays(null)
    }
  }, [areValid, debouncedStartDate, debouncedEndDate])

  const showDays = areValid && !isLoading
  const showEmpty = !areValid && !isLoading

  return (
    <Text mb="0.3rem">
      {t('vacation_form.working_days') + ': '}
      {isLoading ? <span>{t('accessibility.loading')}</span> : null}
      {showDays ? <span data-testid="working_days">{numberOfDays}</span> : null}
      {showEmpty ? '-' : ''}
    </Text>
  )
}
