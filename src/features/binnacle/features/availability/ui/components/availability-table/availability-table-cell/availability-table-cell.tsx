import { FC } from 'react'
import { Box, Td, useColorModeValue } from '@chakra-ui/react'
import { isWeekend } from '../../../../../../../../shared/utils/chrono'
import { AbsenceItem } from '../absence-item/absence-item'
import { AbsenceWithOverflowInfo } from '../../../../domain/absence-with-overflow-info'

interface Props {
  day: Date
  isHoliday: boolean
  absences?: AbsenceWithOverflowInfo[]
}

export const AvailabilityTableCell: FC<Props> = ({ day, isHoliday, absences }) => {
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
        {absences
          ? absences.map((absence, index) => (
              <AbsenceItem
                key={index}
                absence={absence}
                overflowType={absence.overflowType}
              ></AbsenceItem>
            ))
          : ''}
      </Box>
    </Td>
  )
}
