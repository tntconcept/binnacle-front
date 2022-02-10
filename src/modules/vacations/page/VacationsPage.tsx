import { Button, Flex, Stack } from '@chakra-ui/react'
import { observer } from 'mobx-react'
import SelectYear from 'modules/vacations/components/SelectYear'
import { VacationDetails } from 'modules/vacations/components/VacationDetails'
import { VacationFormModal } from 'modules/vacations/components/VacationFormModal/VacationFormModal'
import { VacationTable } from 'modules/vacations/components/VacationTable/VacationTable'
import { GetVacationsByYearAction } from 'modules/vacations/data-access/actions/get-vacations-by-year-action'
import type { VacationFormValues } from 'modules/vacations/data-access/interfaces/vacation-form-values.interface'
import { VacationsState } from 'modules/vacations/data-access/state/vacations-state'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGlobalState } from 'shared/arch/hooks/use-global-state'
import { PageTitle } from 'shared/components/PageTitle'
import { useIsMobile } from 'shared/hooks'
import type { Vacation } from 'shared/types/Vacation'
import chrono from 'shared/utils/chrono'
import { useActionOnMount } from 'shared/arch/hooks/use-action-on-mount'

const VacationsPage = () => {
  const { t } = useTranslation()
  const { vacations, vacationDetails } = useGlobalState(VacationsState)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [initialFormValues, setInitialFormValues] = useState<VacationFormValues>({
    id: undefined,
    startDate: chrono().format('yyyy-MM-dd'),
    endDate: chrono().plus(1, 'day').format('yyyy-MM-dd'),
    description: ''
  })

  const changeFormVisibility = (open: boolean) => {
    if (!open) {
      setInitialFormValues({
        id: undefined,
        startDate: chrono().format('yyyy-MM-dd'),
        endDate: chrono().plus(1, 'day').format('yyyy-MM-dd'),
        description: ''
      })
    }

    setIsFormOpen(open)
  }

  const handleUpdateVacation = (vacation: Vacation) => {
    setInitialFormValues({
      id: vacation.id,
      startDate: chrono(vacation.startDate).format('yyyy-MM-dd'),
      endDate: chrono(vacation.endDate).format('yyyy-MM-dd'),
      description: vacation.description || ''
    })
    setIsFormOpen(true)
  }

  const loading = useActionOnMount(GetVacationsByYearAction)

  const isMobile = useIsMobile()

  return (
    <PageTitle title={t('pages.vacations')}>
      <Stack mx={[5, 24]} my={[6, 10]} spacing={4}>
        <Flex align="flex-end" justify="space-between" maxWidth="600px">
          <SelectYear />
          <Button onClick={() => changeFormVisibility(true)}>
            {t('vacation_form.open_form_button')}
          </Button>
        </Flex>
        <VacationFormModal
          isOpen={isFormOpen}
          initialValues={initialFormValues}
          onClose={() => changeFormVisibility(false)}
        />
        <VacationDetails vacationDetails={vacationDetails} loading={loading} />
        <VacationTable
          isMobile={isMobile}
          vacations={vacations}
          loading={loading}
          onUpdateVacation={handleUpdateVacation}
        />
      </Stack>
    </PageTitle>
  )
}

export default observer(VacationsPage)
