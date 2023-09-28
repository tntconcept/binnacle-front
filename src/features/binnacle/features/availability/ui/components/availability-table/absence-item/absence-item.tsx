import { Box, Text } from '@chakra-ui/react'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Absence } from '../../../../domain/absence'
import { chrono } from '../../../../../../../../shared/utils/chrono'
import { AbsenceOverflow } from '../../../../domain/absence-overflow'

interface Props {
  absence: Absence
  overflowType: AbsenceOverflow
}

export const AbsenceItem: FC<Props> = ({ absence, overflowType }) => {
  const { t } = useTranslation()

  const getDurationInDays = () => {
    const duration = chrono(absence.endDate).diff(absence.startDate, 'day')
    const cellPadding = '24px'
    const boxSize = '48px'
    const absencePadding = '8px'

    if (overflowType === 'end') {
      return `calc(${(duration + 1) * 100}% + ${duration}px - ${cellPadding})`
    }

    if (overflowType === 'both') {
      return `calc(${
        duration * 100
      }% + ${boxSize} + ${cellPadding} * 2 + ${boxSize} - ${absencePadding})`
    }

    if (overflowType === 'start') {
      return `calc(${duration * 100}% + ${boxSize} + ${cellPadding})`
    }

    return `calc(${duration * 100}% + ${boxSize})`
  }

  const getBorderRadius = () => {
    if (overflowType === 'end') {
      return '14px 0 0 14px '
    }

    if (overflowType === 'start') {
      return '0 14px 14px 0'
    }

    if (overflowType === 'both') {
      return '0 0 0 0'
    }

    return '14px'
  }

  const getAbsenceTypeName = () =>
    absence.type === 'VACATION' ? 'absences.vacation' : 'absences.paidLeave'

  return (
    <Box
      fontSize="xs"
      py="4px"
      px="8px"
      gap="4px"
      overflow="hidden"
      textOverflow="ellipsis"
      whiteSpace="nowrap"
      width={getDurationInDays()}
      border="1px solid"
      display="flex"
      bgColor={'gray.400'}
      borderRadius={getBorderRadius()}
      zIndex={1}
      style={{
        position: 'absolute',
        top: '50%',
        transform: 'translate(0, -50%)',
        ...((overflowType === 'start' || overflowType === 'both') && { left: 0 })
      }}
    >
      <Text textOverflow={'ellipsis'} overflow={'hidden'}>
        {t(`${getAbsenceTypeName()}`)}
      </Text>
    </Box>
  )
}
