import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from 'pages/vacation/VacationTable/Table'
import { DataOrModifiedFn } from 'use-async-resource/src/index'
import {
  IHolidays,
  IPrivateHoliday,
  PrivateHolidayState
} from 'api/interfaces/IHolidays'
import { VacationBadge } from 'pages/vacation/VacationTable/VacationStatusBadge'
import { Stack, Button } from '@chakra-ui/core'
import { RemoveVacationButton } from './RemoveVacationButton'
import { formatVacationPeriod } from './formatVacationPeriod'

interface Props {
  holidays: DataOrModifiedFn<IHolidays>
  onEdit: (privateHoliday: IPrivateHoliday) => void
  onRemove: (id: number) => void
}

const VacationTableDesktop: React.FC<Props> = (props) => {
  const holidays = props.holidays().privateHolidays

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Periodo</TableHeader>
          <TableHeader>Días</TableHeader>
          <TableHeader>Estado</TableHeader>
          <TableHeader>Descripción</TableHeader>
          <TableHeader>Observaciones</TableHeader>
          <TableHeader>Acciones</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {holidays.length === 0 && <p>No tienes vacaciones</p>}
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
                <Stack
                  direction="row"
                  spacing={2}>
                  <Button
                    colorScheme="blue"
                    variant="ghost"
                    size="sm"
                    px={0}
                    onClick={() => props.onEdit(holiday)}
                  >
                    Editar
                  </Button>
                  <RemoveVacationButton
                    //@ts-ignore
                    onRemove={() => props.onRemove(holiday.id!)}
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
