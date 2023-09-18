import { FC } from 'react'
import { useCalendarContext } from '../../../activity/ui/contexts/calendar-context'
import { Table, Th, Thead, Tr, useColorModeValue } from '@chakra-ui/react'
import { chrono } from '../../../../../../shared/utils/chrono'
import { AvailabilityTableCellHeader } from './availability-table-cell-header'

export const AvailabilityTable: FC = () => {
  const { selectedDate } = useCalendarContext()
  const daysOfMonth = chrono(chrono(selectedDate).startOf('month').getDate()).eachDayUntil(
    chrono(selectedDate).endOf('month').getDate()
  )
  const borderColor = useColorModeValue('gray.300', 'gray.700')
  const tableHeaders = (
    <Thead>
      <Tr>
        <Th></Th>
        {daysOfMonth.map((day, index) => (
          <Th key={index} border={'1px solid'} borderColor={borderColor}>
            <AvailabilityTableCellHeader day={day}></AvailabilityTableCellHeader>
          </Th>
        ))}
      </Tr>
    </Thead>
  )

  return <Table>{tableHeaders}</Table>
}
