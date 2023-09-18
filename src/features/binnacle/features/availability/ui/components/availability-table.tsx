import { FC } from 'react'
import { useCalendarContext } from '../../../activity/ui/contexts/calendar-context'
import { Table, Th, Thead, Tr } from '@chakra-ui/react'
import { chrono } from '../../../../../../shared/utils/chrono'
import { AvailabilityTableCellHeader } from './availability-table-cell-header'

export const AvailabilityTable: FC = () => {
  const { selectedDate } = useCalendarContext()
  const daysOfMonth = chrono(chrono(selectedDate).startOf('month').getDate()).eachDayUntil(
    chrono(selectedDate).endOf('month').getDate()
  )

  const tableHeaders = (
    <Thead>
      <Tr>
        <Th></Th>
        {daysOfMonth.map((day, index) => (
          <AvailabilityTableCellHeader key={index} day={day}></AvailabilityTableCellHeader>
        ))}
      </Tr>
    </Thead>
  )

  return <Table>{tableHeaders}</Table>
}
