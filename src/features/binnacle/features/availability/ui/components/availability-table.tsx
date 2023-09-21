import { FC, useMemo } from 'react'
import { useCalendarContext } from '../../../activity/ui/contexts/calendar-context'
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { chrono } from '../../../../../../shared/utils/chrono'
import { AvailabilityTableCellHeader } from './availability-table-cell-header'
import { useExecuteUseCaseOnMount } from '../../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { GetHolidaysQry } from '../../../holiday/application/get-holidays-qry'
import { AvailabilityTableCell } from './availability-table-cell'
import { GetAbsencesQry } from '../../application/get-absences-qry'

export const AvailabilityTable: FC = () => {
  const { selectedDate } = useCalendarContext()

  const selectedDateInterval = useMemo(() => {
    return {
      startOfMonth: chrono(selectedDate).startOf('month').getDate(),
      endOfMonth: chrono(selectedDate).endOf('month').getDate()
    }
  }, [selectedDate])

  const { result: absences } = useExecuteUseCaseOnMount(GetAbsencesQry, {
    userId: 1,
    organizationId: 1,
    projectId: 1,
    startDate: selectedDateInterval.startOfMonth,
    endDate: selectedDateInterval.endOfMonth
  })

  const daysOfMonth = chrono(selectedDateInterval.startOfMonth).eachDayUntil(
    selectedDateInterval.endOfMonth
  )

  const { result: holidays = [] } = useExecuteUseCaseOnMount(GetHolidaysQry, {
    start: selectedDateInterval.startOfMonth,
    end: selectedDateInterval.endOfMonth
  })

  const checkIfHoliday = (day: Date) =>
    holidays.some((holiday) => chrono(day).isSameDay(holiday.date))

  const tableHeaders = (
    <Thead>
      <Tr>
        <Th border="none"></Th>
        {daysOfMonth.map((day, index) => (
          <AvailabilityTableCellHeader
            key={index}
            day={day}
            isHoliday={checkIfHoliday(day)}
          ></AvailabilityTableCellHeader>
        ))}
      </Tr>
    </Thead>
  )

  const tableRows = (
    <Tbody>
      {absences?.map((absence, index) => (
        <Tr key={index}>
          <Td border="none">{absence.userName}</Td>
          {daysOfMonth.map((day, index) => (
            <AvailabilityTableCell
              key={index}
              day={day}
              isHoliday={checkIfHoliday(day)}
            ></AvailabilityTableCell>
          ))}
        </Tr>
      ))}
    </Tbody>
  )

  return (
    <Table>
      {tableHeaders}
      {tableRows}
    </Table>
  )
}
