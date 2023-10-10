import { FC } from 'react'
import { Box, Td } from '@chakra-ui/react'
import { isWeekend } from '../../../../../../../../shared/utils/chrono'
import { AbsenceItem } from '../absence-item/absence-item'
import { AbsenceWithOverflowInfo } from '../../../../domain/absence-with-overflow-info'
import { useIsMobile } from '../../../../../../../../shared/hooks/use-is-mobile'

interface Props {
  day: Date
  isHoliday: boolean
  userName: string
  absences?: AbsenceWithOverflowInfo[]
}

export const AvailabilityTableCell: FC<Props> = ({ day, isHoliday, absences, userName }) => {
  const isMobile = useIsMobile()

  return (
    <Td
      textAlign={'center'}
      position={'relative'}
      padding={0}
      px={'6px'}
      backgroundColor={isWeekend(day) || isHoliday ? 'rgba(0, 0, 0, 0.10)' : ''}
    >
      <Box
        style={!isMobile ? { width: '100%', height: '100%' } : { width: '36px', height: '36px' }}
      >
        {absences
          ? absences.map((absence, index) => (
              <AbsenceItem
                key={index}
                userName={userName}
                absence={absence}
                overflowType={absence.overflowType}
              ></AbsenceItem>
            ))
          : ''}
      </Box>
    </Td>
  )
}
