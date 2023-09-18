import { FC } from 'react'
import { Box, Text } from '@chakra-ui/react'
import { chrono } from '../../../../../../shared/utils/chrono'
import { getWeekdaysName } from '../../../activity/utils/get-weekdays-name'

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
    <Box display="flex" flexDirection="column" alignItems="center">
      <Text>{weekDays[getWeekDay(day) - 1]}</Text>
      <Text>{day.getDate()}</Text>
    </Box>
  )
}
