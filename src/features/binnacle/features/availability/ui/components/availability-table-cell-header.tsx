import { FC } from 'react'
import { Box, Text } from '@chakra-ui/react'
import { chrono } from '../../../../../../shared/utils/chrono'
import { getWeekdaysName } from '../../../activity/utils/get-weekdays-name'
import { isToday } from 'date-fns'
import './availability-table-cell-header.css'

interface Props {
  day: Date
}

const weekDays = getWeekdaysName()

const getWeekDay = (date: Date) => {
  const weekDay = chrono(date).get('weekday')
  return weekDay === 0 ? 7 : weekDay
}

export const AvailabilityTableCellHeader: FC<Props> = ({ day }) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={5}>
      <Text>{weekDays[getWeekDay(day) - 1]}</Text>
      <Text padding={2} className={isToday(day) ? 'is-today' : 'test'}>
        {day.getDate()}
      </Text>
    </Box>
  )
}
