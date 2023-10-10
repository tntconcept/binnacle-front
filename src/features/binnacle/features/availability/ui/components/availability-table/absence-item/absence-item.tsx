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
    const cellPadding = '6px'
    const boxSize = isMobile ? '36px' : '36px'
    const durationPlusLast = duration + 1

    //The calculation of end is based on the duration of the absence plus an element to reach the end of the block,
    // minus 1px for each block present due to the margin each one has,
    // and subtracting the cell's padding to ensure it accounts for the same padding at the beginning and end.

    if (overflowType === 'end') {
      return `calc(${durationPlusLast * 100}% + ${durationPlusLast}px - ${cellPadding})`
    }

    //The calc is based in total width plus 1px for each block present due to the margin each one has
    if (overflowType === 'both') {
      return `calc(${durationPlusLast * 100}% + ${duration}px)`
    }

    //The calculation is based on the duration of the absence plus an element to reach the end of the block, minus 1px for each block present due to the margin each one has, and subtracting the padding that we lose at the beginning.
    if (overflowType === 'start') {
      return `calc(${durationPlusLast * 100}% + ${duration}px - ${cellPadding})`
    }

    //The calculation is based on the duration of the absence plus an element to reach the end of the block, minus 1px for each block present due to the margin each one has, and adding the block size without padding.
    return `calc(${duration * 100}% + ${boxSize} + ${durationPlusLast}px - ${cellPadding})`
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
      py="1px"
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
