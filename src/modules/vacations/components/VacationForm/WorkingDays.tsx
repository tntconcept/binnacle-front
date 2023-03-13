import { Text } from '@chakra-ui/react'
import type { VacationFormValues } from 'modules/vacations/data-access/interfaces/vacation-form-values.interface'
import { useEffect, useState } from 'react'
import type { Control } from 'react-hook-form'
import { useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDebounce } from 'shared/hooks'
import { VacationsRepository } from 'modules/vacations/data-access/interfaces/vacations-repository'
import { container } from 'tsyringe'
import { VACATIONS_REPOSITORY } from 'shared/data-access/ioc-container/ioc-container.tokens'

interface Props {
  control: Control<VacationFormValues>
}

const validDateFormat = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/

const validatePeriod = (startDate: string, endDate: string): boolean => {
  return validDateFormat.test(startDate) && validDateFormat.test(endDate)
}

function WorkingDays(props: Props) {
  const { t } = useTranslation()
  const [daysQt, setDaysQt] = useState<null | number>(null)

  const [startDate, endDate] = useWatch({
    control: props.control,
    name: ['startDate', 'endDate']
  })

  const debouncedStartDate = useDebounce(startDate, 500)
  const debouncedEndDate = useDebounce(endDate, 500)

  const areValid = validatePeriod(debouncedStartDate, debouncedEndDate)
  const [isLoading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const vacationsRepository = container.resolve<VacationsRepository>(VACATIONS_REPOSITORY)
    if (areValid) {
      setLoading(true)
      vacationsRepository
        .getCorrespondingVacationDays(debouncedStartDate, debouncedEndDate)
        .then((result) => {
          setLoading(false)
          setDaysQt(result)
        })
        .catch(() => setLoading(false))
    } else {
      setDaysQt(null)
    }
  }, [areValid, debouncedStartDate, debouncedEndDate])

  const showDays = areValid && !isLoading
  const showEmpty = !areValid && !isLoading

  return (
    <Text mb="0.3rem">
      {t('vacation_form.working_days') + ': '}
      {isLoading ? <span>{t('accessibility.loading')}</span> : null}
      {showDays ? <span data-testid="working_days">{daysQt}</span> : null}
      {showEmpty ? '-' : ''}
    </Text>
  )
}

export default WorkingDays
