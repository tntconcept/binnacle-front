import { FC } from 'react'
import { Td, useColorModeValue } from '@chakra-ui/react'
import { chrono, isWeekend } from '../../../../../../shared/utils/chrono'
import { Absence } from '../../domain/absence'
import { AbsenceItem } from './absence-item'

interface Props {
  day: Date
  isHoliday: boolean
  absence: Absence
}

export const AvailabilityTableCell: FC<Props> = ({ day, isHoliday, absence }) => {
  const borderColor = useColorModeValue('gray.300', 'gray.700')

  const isSameDay = () => chrono(day).isSameDay(absence.startDate)
  const getDurationInDays = () => chrono(absence.endDate).diff(absence.startDate, 'day')

  return (
    <Td
      border={'1px solid'}
      borderColor={borderColor}
      textAlign={'center'}
      position={'relative'}
      backgroundColor={isWeekend(day) || isHoliday ? 'rgba(0, 0, 0, 0.10)' : ''}
    >
      {isSameDay() ? (
        <AbsenceItem duration={getDurationInDays()} type={absence.type}></AbsenceItem>
      ) : (
        ''
      )}
    </Td>
  )
}
