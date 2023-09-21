import { FC } from 'react'
import { Td, useColorModeValue } from '@chakra-ui/react'
import { isWeekend } from '../../../../../../shared/utils/chrono'

export const AvailabilityTableCell: FC<{ day: Date; isHoliday: boolean }> = ({
  day,
  isHoliday
}) => {
  const borderColor = useColorModeValue('gray.300', 'gray.700')

  return (
    <Td
      border={'1px solid'}
      borderColor={borderColor}
      textAlign={'center'}
      backgroundColor={isWeekend(day) || isHoliday ? 'rgba(0, 0, 0, 0.10)' : ''}
    >
      {day.getDate()}
    </Td>
  )
}
