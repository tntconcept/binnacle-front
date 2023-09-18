import { FC } from 'react'
import { useCalendarContext } from '../../../activity/ui/contexts/calendar-context'
import { Table, Th, Thead, Tr } from '@chakra-ui/react'
import { chrono } from '../../../../../../shared/utils/chrono'
import { AvailabilityTableCellHeader } from './availability-table-cell-header'
import { useExecuteUseCaseOnMount } from '../../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { GetHolidaysQry } from '../../../holiday/application/get-holidays-qry'

export const AvailabilityTable: FC = () => {
  const { selectedDate } = useCalendarContext()
  const daysOfMonth = chrono(chrono(selectedDate).startOf('month').getDate()).eachDayUntil(
    chrono(selectedDate).endOf('month').getDate()
  )

  const { result: holidays = [] } = useExecuteUseCaseOnMount(GetHolidaysQry, {
    start: chrono(selectedDate).startOf('month').getDate(),
    end: chrono(selectedDate).endOf('month').getDate()
  })

  const tableHeaders = (
    <Thead>
      <Tr>
        <Th></Th>
        {daysOfMonth.map((day, index) => (
          <AvailabilityTableCellHeader
            key={index}
            day={day}
            isHoliday={holidays.some((holiday) => chrono(day).isSameDay(holiday.date))}
          ></AvailabilityTableCellHeader>
        ))}
      </Tr>
    </Thead>
  )

  return <Table>{tableHeaders}</Table>
}
