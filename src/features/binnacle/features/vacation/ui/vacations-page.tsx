import { Button, Flex, Stack } from '@chakra-ui/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { PageWithTitle } from 'shared/components/page-with-title/page-with-title'
import { useIsMobile } from 'shared/hooks'
import chrono from 'shared/utils/chrono'
import { NewVacation } from '../domain/new-vacation'
import { UpdateVacation } from '../domain/update-vacation'
import { Vacation } from '../domain/vacation'
import { SelectYear } from './components/select-year'
import { VacationDetails } from './components/vacation-details'
import { VacationFormModal } from './components/vacation-form-modal/vacation-form-modal'
import { VacationTable } from './components/vacation-table/vacation-table'

const newVacationValues: NewVacation = {
  startDate: chrono().getDate(),
  endDate: chrono().plus(1, 'day').getDate(),
  description: ''
}

const VacationsPage = () => {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [chargeYear, setChargeYear] = useState<number>(
    searchParams.has('year') ? Number(searchParams.get('year')) : chrono().get('year')
  )

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [initialFormValues, setInitialFormValues] = useState<NewVacation | UpdateVacation>(
    newVacationValues
  )

  const changeFormVisibility = (open: boolean) => {
    if (!open) {
      setInitialFormValues(newVacationValues)
    }

    setIsFormOpen(open)
  }

  const changeYearSelected = (newYear: number) => {
    setSearchParams({ year: newYear.toFixed() })
    setChargeYear(newYear)
  }

  const handleUpdateVacation = (vacation: Vacation) => {
    setInitialFormValues({
      id: vacation.id,
      startDate: chrono(vacation.startDate).getDate(),
      endDate: chrono(vacation.endDate).getDate(),
      description: vacation.description || ''
    })
    setIsFormOpen(true)
  }

  const isMobile = useIsMobile()

  return (
    <PageWithTitle title={t('pages.vacations')}>
      <Stack spacing={4}>
        <Flex align="flex-end" justify="space-between" maxWidth="600px">
          <SelectYear year={chargeYear} onChargeYearChanged={changeYearSelected} />
          <Button onClick={() => changeFormVisibility(true)}>
            {t('vacation_form.open_form_button')}
          </Button>
        </Flex>
        <VacationFormModal
          isOpen={isFormOpen}
          initialValues={initialFormValues}
          onClose={() => changeFormVisibility(false)}
        />
        <VacationDetails chargeYear={chargeYear} />
        <VacationTable
          isMobile={isMobile}
          onUpdateVacation={handleUpdateVacation}
          chargeYear={chargeYear}
        />
      </Stack>
    </PageWithTitle>
  )
}

export default VacationsPage
