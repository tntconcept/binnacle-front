import { Box } from '@chakra-ui/react'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Absence } from '../../../domain/absence'
import { chrono } from '../../../../../../../shared/utils/chrono'

interface Props {
  absence: Absence
  situation: string
  interval: { start: Date; end: Date }
}

export const AbsenceItem: FC<Props> = ({ absence, interval, situation }) => {
  const { t } = useTranslation()

  const getDurationInDays = () => {
    const duration = chrono(absence.endDate).diff(absence.startDate, 'day')

    if (absence.endDate > interval.end) {
      const diff = chrono(absence.endDate).diff(interval.end, 'day')
      return `calc(${(duration - diff) * 100}% - 20px)`
    }

    return situation === 'start'
      ? `calc(${duration * 100}% + 72px)`
      : `calc(${duration * 100}% + 48px)`
  }

  const getBorderRadius = () => {
    if (absence.endDate > interval.end) {
      return '14px 0 0 14px '
    }

    if (situation === 'start') {
      return '0 14px 14px 0'
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
        ...(situation === 'start' && { left: 0 })
      }}
    >
      {t(`${getAbsenceTypeName()}`)}
    </Box>
  )
}
