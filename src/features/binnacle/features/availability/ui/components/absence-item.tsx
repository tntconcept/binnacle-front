import { Box } from '@chakra-ui/react'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { AbsenceType } from '../../domain/absence-type'

interface Props {
  durationInDays: number
  type: AbsenceType
}

export const AbsenceItem: FC<Props> = ({ durationInDays, type }) => {
  const { t } = useTranslation()

  const getAbsenceTypeName = () =>
    type === 'VACATION' ? 'absences.vacation' : 'absences.paidLeave'

  return (
    <Box
      fontSize="xs"
      py="4px"
      px="8px"
      gap="4px"
      overflow="hidden"
      textOverflow="ellipsis"
      whiteSpace="nowrap"
      width={`calc(${durationInDays * 100}% + 48px - 1em)`}
      border="1px solid"
      display="flex"
      bgColor={'gray.400'}
      borderRadius="14px"
      zIndex={1}
      style={{
        position: 'absolute',
        top: '50%',
        transform: 'translate(0, -50%)'
      }}
    >
      {t(`${getAbsenceTypeName()}`)}
    </Box>
  )
}
