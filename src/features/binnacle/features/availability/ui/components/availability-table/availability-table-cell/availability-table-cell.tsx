import { FC } from 'react'
import { Box, Td, useColorModeValue } from '@chakra-ui/react'
import { isWeekend } from '../../../../../../../../shared/utils/chrono'
import { AbsenceItem } from '../absence-item/absence-item'
import { AbsenceWithOverflowInfo } from '../../../../domain/absence-with-overflow-info'
import { useIsMobile } from '../../../../../../../../shared/hooks/use-is-mobile'

interface Props {
  day: Date
  isHoliday: boolean
  absences?: AbsenceWithOverflowInfo[]
}

export const AvailabilityTableCell: FC<Props> = ({ day, isHoliday, absences }) => {
  const borderColor = useColorModeValue('gray.300', 'gray.700')

  const isMobile = useIsMobile()

  return (
    <Td
      border={'1px solid'}
      borderColor={borderColor}
      textAlign={'center'}
      position={'relative'}
      padding={'12px'}
      backgroundColor={isWeekend(day) || isHoliday ? 'rgba(0, 0, 0, 0.10)' : ''}
    >
      <Box
        style={!isMobile ? { width: '48px', height: '48px' } : { width: '36px', height: '36px' }}
      >
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
