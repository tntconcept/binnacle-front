import { Box, Text, useColorModeValue } from '@chakra-ui/react'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Absence } from '../../../../domain/absence'
import { chrono } from '../../../../../../../../shared/utils/chrono'
import { AbsenceOverflow } from '../../../../domain/absence-overflow'
import { useIsMobile } from '../../../../../../../../shared/hooks/use-is-mobile'

interface Props {
  userName: string
  absence: Absence
  overflowType: AbsenceOverflow
}

export const AbsenceItem: FC<Props> = ({ absence, userName, overflowType }) => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()

  const getDurationInDays = () => {
    const duration = chrono(absence.endDate).diff(absence.startDate, 'day')
    const cellPadding = '12px'
    const boxSize = isMobile ? '36px' : '48px'
    const durationPlusLast = duration + 1

    if (overflowType === 'end') {
      return `calc(${durationPlusLast * 100}% + ${durationPlusLast - 1}px - ${cellPadding})`
    }

    if (overflowType === 'both') {
      return `calc(${durationPlusLast * 100}% + ${durationPlusLast - 1}px)`
    }

    if (overflowType === 'start') {
      return `calc(${durationPlusLast * 100}%)`
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

  const backgroundColor = useColorModeValue('gray.300', 'gray.600')

  return (
    <Box
      tabIndex={0}
      aria-label={t('absences.absenceItemDescription', {
        name: userName,
        type: t(getAbsenceTypeName()),
        startDate: absence.startDate,
        endDate: absence.endDate
      })}
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
      bgColor={backgroundColor}
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
