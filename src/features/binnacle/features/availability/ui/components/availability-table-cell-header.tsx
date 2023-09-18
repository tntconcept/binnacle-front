import { FC } from 'react'
import { Box, Text, Th, useColorModeValue } from '@chakra-ui/react'
import { chrono, isWeekend } from '../../../../../../shared/utils/chrono'
import { getWeekdaysName } from '../../../activity/utils/get-weekdays-name'
import { isToday } from 'date-fns'
import './availability-table-cell-header.css'

interface Props {
  day: Date
  isHoliday: boolean
}

const weekDays = getWeekdaysName()

const getWeekDay = (date: Date) => {
  const weekDay = chrono(date).get('weekday')
  return weekDay === 0 ? 7 : weekDay
}

export const AvailabilityTableCellHeader: FC<Props> = ({ day, isHoliday }) => {
  const borderColor = useColorModeValue('gray.300', 'gray.700')

  return (
    <Th
      border={'1px solid'}
      borderColor={borderColor}
      backgroundColor={isWeekend(day) || isHoliday ? borderColor : ''}
    >
      <Box display="flex" flexDirection="column" alignItems="center" gap={5}>
        <Text>{weekDays[getWeekDay(day) - 1]}</Text>
        <Text padding={2} className={isToday(day) ? 'is-today' : ''}>
          {day.getDate()}
        </Text>
      </Box>
    </Th>
  )
}
