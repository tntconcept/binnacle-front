import { FC } from 'react'
import { Box, Td, useColorModeValue } from '@chakra-ui/react'
import { AbsenceItem } from './absence-item'
import { Absence } from '../../../domain/absence'
import { chrono, isWeekend } from '../../../../../../../shared/utils/chrono'

interface Props {
  day: Date
  isHoliday: boolean
  absence?: Absence
}

export const AvailabilityTableCell: FC<Props> = ({ day, isHoliday, absence }) => {
  const borderColor = useColorModeValue('gray.300', 'gray.700')

  const isSameDay = (absenceDay: Date) => chrono(day).isSameDay(absenceDay)
  const getDurationInDays = (absence: Absence) =>
    chrono(absence.endDate).diff(absence.startDate, 'day')

  return (
    <Td
      border={'1px solid'}
      borderColor={borderColor}
      textAlign={'center'}
      position={'relative'}
      backgroundColor={isWeekend(day) || isHoliday ? 'rgba(0, 0, 0, 0.10)' : ''}
    >
      <Box width={'48px'} height={'48px'}>
        {absence && isSameDay(absence.startDate) ? (
          <AbsenceItem
            durationInDays={getDurationInDays(absence)}
            type={absence.type}
          ></AbsenceItem>
        ) : (
          ''
        )}
      </Box>
    </Td>
  )
}
