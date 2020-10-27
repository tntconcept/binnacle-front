import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from 'pages/vacation/VacationTable/TableElements'
import { DataOrModifiedFn } from 'use-async-resource/src/index'
import { IHolidays, IVacation, VacationState } from 'core/api/interfaces'
import { VacationBadge } from 'pages/vacation/VacationTable/VacationStateBadge'
import { Button, Stack } from '@chakra-ui/core'
import { RemoveVacationButton } from './RemoveVacationButton'
import { formatVacationPeriod } from './VacationTable.utils'
import { useTranslation } from 'react-i18next'

interface Props {
  holidays: DataOrModifiedFn<IHolidays>
  onEdit: (privateHoliday: IVacation) => void
  onRefreshHolidays: () => void
  deleteVacationPeriod: (id: number) => Promise<void>
}

const VacationTableDesktop: React.FC<Props> = (props) => {
  const { t } = useTranslation()
  const vacations = props.holidays().vacations

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>{t('vacation_table.period')}</TableHeader>
          <TableHeader>{t('vacation_table.days')}</TableHeader>
          <TableHeader>{t('vacation_table.state')}</TableHeader>
          <TableHeader>{t('vacation_table.description')}</TableHeader>
          <TableHeader>{t('vacation_table.observations')}</TableHeader>
          <TableHeader>{t('vacation_table.actions')}</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {vacations.length === 0 && (
          <TableRow>
            <TableCell
              // @ts-ignore
              colSpan="6"
            >
              {t('vacation_table.empty')}
            </TableCell>
          </TableRow>
        )}
        {vacations.map((vacation) => (
          // @ts-ignore
          <TableRow key={vacation.id!}>
            <TableCell>{formatVacationPeriod(vacation.startDate, vacation.endDate)}</TableCell>
            <TableCell>{vacation.days.length}</TableCell>
            <TableCell>
              <VacationBadge state={vacation.state} />
            </TableCell>
            <TableCell>{vacation.description || '-'}</TableCell>
            <TableCell>{vacation.observations || '-'}</TableCell>
            <TableCell>
              {vacation.state === VacationState.Pending && (
                <Stack direction="row" spacing={2}>
                  <Button
                    colorScheme="blue"
                    variant="ghost"
                    size="sm"
                    onClick={() => props.onEdit(vacation)}
                  >
                    {t('actions.edit')}
                  </Button>
                  <RemoveVacationButton
                    vacation={vacation}
                    deleteVacationPeriod={props.deleteVacationPeriod}
                    onRefreshHolidays={props.onRefreshHolidays}
                  />
                </Stack>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default VacationTableDesktop
