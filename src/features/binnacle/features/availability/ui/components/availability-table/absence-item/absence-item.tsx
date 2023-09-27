import { Box, Text } from '@chakra-ui/react'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Absence } from '../../../../domain/absence'
import { chrono } from '../../../../../../../../shared/utils/chrono'

interface Props {
  absence: Absence
  situation: string
}

export const AbsenceItem: FC<Props> = ({ absence, situation }) => {
  const { t } = useTranslation()

  const getDurationInDays = () => {
    const duration = chrono(absence.endDate).diff(absence.startDate, 'day')

    if (situation === 'end') {
      return `calc(${(duration + 1) * 100}% + ${duration}px - 24px)`
    }

    if (situation === 'both') {
      return `calc(${duration * 100}% + 136px)`
    }

    if (situation === 'start') {
      return `calc(${duration * 100}% + 72px)`
    }

    return `calc(${duration * 100}% + 48px)`
  }

  const getBorderRadius = () => {
    if (situation === 'end') {
      return '14px 0 0 14px '
    }

    if (situation === 'start') {
      return '0 14px 14px 0'
    }

    if (situation === 'both') {
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
        ...((situation === 'start' || situation === 'both') && { left: 0 })
      }}
    >
      <Text textOverflow={'ellipsis'} overflow={'hidden'}>
        {t(`${getAbsenceTypeName()}`)}
      </Text>
    </Box>
  )
}
