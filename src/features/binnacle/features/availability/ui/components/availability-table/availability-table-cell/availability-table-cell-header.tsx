import { FC } from 'react'
import { Box, Text, Th, useColorModeValue } from '@chakra-ui/react'
import { isToday } from 'date-fns'
import './availability-table-cell-header.css'
import { chrono, isWeekend } from '../../../../../../../../shared/utils/chrono'
import { getWeekdaysName } from '../../../../../activity/utils/get-weekdays-name'
import { useIsMobile } from '../../../../../../../../shared/hooks/use-is-mobile'

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

  const isMobile = useIsMobile()

  return (
    <Th
      borderColor={borderColor}
      padding={0}
      py={1}
      width={isMobile ? '36px' : '32px'}
      backgroundColor={isWeekend(day) || isHoliday ? 'rgba(0, 0, 0, 0.10)' : ''}
    >
      <Box display="flex" flexDirection="column" alignItems="center" gap={5} padding={'0px'}>
        <Text fontSize={'x-small'}>{weekDays[getWeekDay(day) - 1]}</Text>
        <Text py={1} px={1} id={isToday(day) ? 'is-today' : ''}>
          {day.getDate()}
        </Text>
      </Box>
    </Th>
  )
}
