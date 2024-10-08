import { Button, Stack, Table, Tbody, Td, Th, Thead, Tr, useColorModeValue } from '@chakra-ui/react'
import { Vacation } from '../../../../domain/vacation'
import { useTranslation } from 'react-i18next'
import { chrono } from '../../../../../../../../shared/utils/chrono'
import { RemoveVacationButton } from '../remove-vacation-button/remove-vacation-button'
import { VacationBadge } from '../vacation-badge'
import { FC } from 'react'

interface Props {
  vacations: Vacation[]
  onUpdateVacation: (vacation: Vacation) => void
}

const VacationTableDesktop: FC<Props> = (props) => {
  const { t } = useTranslation()
  const bgColor = useColorModeValue('white', undefined)

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
        {props.vacations.map((vacation) => (
          <Tr key={vacation.id}>
            <Td>{`${chrono(vacation.startDate).format('yyyy-MM-dd')} - ${chrono(
              vacation.endDate
            ).format('yyyy-MM-dd')}`}</Td>
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
              {vacation.state === 'ACCEPT' && chrono(vacation.startDate).isAfter(chrono.now()) && (
                <Stack direction="row" spacing={2}>
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
