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
import {
  IHolidays,
  IPrivateHoliday,
  PrivateHolidayState
} from 'api/interfaces/IHolidays'
import { VacationBadge } from 'pages/vacation/VacationTable/VacationStateBadge'
import { Stack, Button } from '@chakra-ui/core'
import { RemoveVacationButton } from './RemoveVacationButton'
import { formatVacationPeriod } from './VacationTable.utils'
import { useTranslation } from 'react-i18next'

interface Props {
  holidays: DataOrModifiedFn<IHolidays>
  onEdit: (privateHoliday: IPrivateHoliday) => void
  onRefreshHolidays: () => void
  deleteVacationPeriod: (id: number) => Promise<void>
}

const VacationTableDesktop: React.FC<Props> = (props) => {
  const { t } = useTranslation()
  const holidays = props.holidays().privateHolidays

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
        {holidays.length === 0 && (
          <TableRow>
            <TableCell
              // @ts-ignore
              colSpan="6"
            >
              {t('vacation_table.empty')}
            </TableCell>
          </TableRow>
        )}
        {holidays.map((holiday) => (
          // @ts-ignore
          <TableRow key={holiday.id!}>
            <TableCell>{formatVacationPeriod(holiday.days)}</TableCell>
            <TableCell>{holiday.days.length}</TableCell>
            <TableCell>
              <VacationBadge state={holiday.state} />
            </TableCell>
            <TableCell>{holiday.userComment || '-'}</TableCell>
            <TableCell>{holiday.observations || '-'}</TableCell>
            <TableCell>
              {holiday.state === PrivateHolidayState.Pending && (
                <Stack direction="row" spacing={2}>
                  <Button
                    colorScheme="blue"
                    variant="ghost"
                    size="sm"
                    px={0}
                    onClick={() => props.onEdit(holiday)}
                  >
                    {t('actions.edit')}
                  </Button>
                  <RemoveVacationButton
                    vacationId={holiday.id!}
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
