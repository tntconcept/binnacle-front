import { Box, useColorModeValue } from '@chakra-ui/react'
import { ActivityDaySummary } from '../../../../../domain/activity-day-summary'
import type { FC, PropsWithChildren } from 'react'
import { chrono } from '../../../../../../../../../shared/utils/chrono'

interface Props {
  selectedMonth: Date
  borderBottom?: boolean
  activityDaySummary: ActivityDaySummary

  onClick(date: Date): void

  isWeekendDay?: boolean
}

export const CellContent: FC<PropsWithChildren<Props>> = (props) => {
  const isOtherMonth = !chrono(props.activityDaySummary.date).isSame(props.selectedMonth, 'month')

  const handleOpenCreateActivityForm = async () => {
    props.onClick(props.activityDaySummary.date)
  }

  const bgOtherMonth = useColorModeValue('#f0f0f4', '#1d232f')
  const borderHoverColor = useColorModeValue('brand.700', 'gray.500')

  return (
    <Box
      position="relative"
      py="4px"
      px="8px"
      height={'100%'}
      cursor="pointer"
      border={'1px solid transparent'}
      bg={isOtherMonth ? bgOtherMonth : undefined}
      _hover={{
        border: '1px solid',
        borderColor: borderHoverColor
      }}
      onClick={handleOpenCreateActivityForm}
    >
      {props.children}
    </Box>
  )
}
