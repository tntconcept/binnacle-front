import { FC } from 'react'
import { Box, Td, useColorModeValue } from '@chakra-ui/react'
import { AbsenceItem } from './absence-item'
import { Absence } from '../../../domain/absence'
import { isWeekend } from '../../../../../../../shared/utils/chrono'

interface Props {
  day: Date
  isHoliday: boolean
  absence?: Absence & { situation: string }
}

export const AvailabilityTableCell: FC<Props> = ({ day, isHoliday, absence }) => {
  const borderColor = useColorModeValue('gray.300', 'gray.700')

  return (
    <Td
      border={'1px solid'}
      borderColor={borderColor}
      textAlign={'center'}
      position={'relative'}
      backgroundColor={isWeekend(day) || isHoliday ? 'rgba(0, 0, 0, 0.10)' : ''}
    >
      <Box width={'48px'} height={'48px'}>
        {absence ? <AbsenceItem absence={absence} situation={absence.situation}></AbsenceItem> : ''}
      </Box>
    </Td>
  )
}
