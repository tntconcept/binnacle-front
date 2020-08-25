import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from 'pages/vacation/Table'
import { DataOrModifiedFn } from 'use-async-resource/src/index'
import { IHolidays, IPrivateHoliday } from 'api/interfaces/IHolidays'
import { VacationBadge } from 'pages/vacation/VacationTable/VacationStatusBadge'

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
        </TableRow>
      </TableHead>
      <TableBody>
        {holidays.map((holiday) => (
          // @ts-ignore
          <TableRow key={holiday.id!}>
            <TableCell>StartDate - EndDate</TableCell>
            <TableCell>{holiday.days.length}</TableCell>
            <TableCell>
              <VacationBadge state={holiday.state} />
            </TableCell>
            <TableCell>{holiday.userComment || '-'}</TableCell>
            <TableCell>{holiday.observations || '-'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default VacationTableDesktop
