import { FC, useEffect, useMemo, useState } from 'react'
import {
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue
} from '@chakra-ui/react'
import { AvailabilityTableCellHeader } from './availability-table-cell-header'
import { AvailabilityTableCell } from './availability-table-cell'
import styles from './availability-table.module.css'
import { AvailabilityTableFilters } from './availability-table-filters/availability-table-filters'
import { Absence } from '../../../domain/absence'
import { chrono } from '../../../../../../../shared/utils/chrono'
import { useExecuteUseCaseOnMount } from '../../../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { GetAbsencesQry } from '../../../application/get-absences-qry'
import { GetHolidaysQry } from '../../../../holiday/application/get-holidays-qry'
import { CalendarControls } from '../../../../activity/ui/calendar-desktop/calendar-controls/calendar-controls'
import { useCalendarContext } from '../../../../activity/ui/contexts/calendar-context'

interface UserAbsences {
  userId: number
  userName: string
  absences: Absence[]
}

export const AvailabilityTable: FC = () => {
  const { selectedDate } = useCalendarContext()
  const [userAbsences, setUserAbsences] = useState<UserAbsences[]>([])

  const selectedDateInterval = useMemo(() => {
    return {
      start: chrono(selectedDate).startOf('month').minus(5, 'day').getDate(),
      end: chrono(selectedDate).endOf('month').plus(5, 'day').getDate()
    }
  }, [selectedDate])

  const { result: absences } = useExecuteUseCaseOnMount(GetAbsencesQry, {
    userId: 1,
    organizationId: 1,
    projectId: 1,
    startDate: selectedDateInterval.start,
    endDate: selectedDateInterval.end
  })

  const daysOfMonth = chrono(selectedDateInterval.start).eachDayUntil(selectedDateInterval.end)

  const { result: holidays = [] } = useExecuteUseCaseOnMount(GetHolidaysQry, {
    start: selectedDateInterval.start,
    end: selectedDateInterval.end
  })

  useEffect(() => {
    const test = absences?.reduce((acc: { [key: number]: UserAbsences }, item: Absence) => {
      const { userId, userName } = item
      if (!acc[userId]) {
        acc[userId] = { userId, userName, absences: [] }
      }
      acc[userId].absences.push(item)
      return acc
    }, {})

    if (test !== undefined) setUserAbsences(Object.values(test))
  }, [absences])

  const checkIfHoliday = (day: Date) =>
    holidays.some((holiday) => chrono(day).isSameDay(holiday.date))

  const borderColor = useColorModeValue('gray.300', 'gray.700')

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

  useEffect(() => {
    const element = document.getElementById('is-today')
    if (element !== null) element.scrollIntoView({ inline: 'center' })
  }, [selectedDate])

  const tableRows = (
    <Tbody>
      {userAbsences?.map((userAbsence, index) => (
        <Tr key={index}>
          <Td border={'1px solid'} borderColor={borderColor}>
            <Text width="20ch" isTruncated>
              {userAbsence.userName}
            </Text>
          </Td>
          {daysOfMonth.map((day, index) => (
            <AvailabilityTableCell
              key={index}
              day={day}
              absence={userAbsence.absences.find((x) => chrono(day).isSameDay(x.startDate))}
              isHoliday={checkIfHoliday(day)}
            ></AvailabilityTableCell>
          ))}
        </Tr>
      ))}
    </Tbody>
  )

  return (
    <>
      <Flex as="section" align="center" justify="space-between" border="none" marginBottom="16px">
        <AvailabilityTableFilters onChange={(e) => console.log(e)} />

        <CalendarControls />
      </Flex>
      <Box display="flex" flexDirection="column" overflowX="auto" overflowY="hidden">
        <Table className={styles['data-table']}>
          {tableHeaders}
          {tableRows}
        </Table>
      </Box>
    </>
  )
}
