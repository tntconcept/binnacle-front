import { Button, Stack, Table, Tbody, Td, Th, Thead, Tr, useColorModeValue } from '@chakra-ui/react'
import { RemoveVacationButton } from 'modules/vacations/components/VacationTable/RemoveVacationButton/RemoveVacationButton'
import { VacationBadge } from 'modules/vacations/components/VacationTable/VacationBadge'
import { useTranslation } from 'react-i18next'
import type { Vacation } from 'shared/types/Vacation'

interface Props {
  vacations: Vacation[]
  onUpdateVacation: (vacation: Vacation) => void
}

const VacationTableDesktop = (props: Props) => {
  const { t } = useTranslation()
  const bgColor = useColorModeValue('white', undefined)
  const descendentSortingHolidayHistory = props.vacations.sort((vacationA, vacationB) =>  (vacationA.id) - (vacationB.id))

  return (
    <Table bgColor={bgColor}>
      <Thead>
        <Tr>
          <Th>{t('vacation_table.period')}</Th>
          <Th>{t('vacation_table.days')}</Th>
          <Th>{t('vacation_table.status')}</Th>
          <Th>{t('vacation_table.description')}</Th>
          <Th>{t('vacation_table.observations')}</Th>
          <Th>{t('vacation_table.actions')}</Th>
        </Tr>
      </Thead>
      <Tbody>
        {props.vacations.length === 0 && (
          <Tr>
            <Td colSpan={6}>{t('vacation_table.empty')}</Td>
          </Tr>
        )}
        {descendentSortingHolidayHistory.map((vacation) => (
          <Tr key={vacation.id}>
            <Td>{`${vacation.startDate} - ${vacation.endDate}`}</Td>
            <Td>{vacation.days.length}</Td>
            <Td>
              <VacationBadge status={vacation.state} />
            </Td>
            <Td>{vacation.description || '-'}</Td>
            <Td>{vacation.observations || '-'}</Td>
            <Td>
              {vacation.state === 'PENDING' && (
                <Stack direction="row" spacing={2}>
                  <Button
                    colorScheme="blue"
                    variant="ghost"
                    size="sm"
                    onClick={() => props.onUpdateVacation(vacation)}
                  >
                    {t('actions.edit')}
                  </Button>
                  <RemoveVacationButton vacationId={vacation.id} />
                </Stack>
              )}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

export default VacationTableDesktop
