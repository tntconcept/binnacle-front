import { Box, useColorModeValue } from '@chakra-ui/react'
import { OpenCreateActivityFormAction } from 'modules/binnacle/data-access/actions/open-create-activity-form-action'
import type { ActivitiesPerDay } from 'modules/binnacle/data-access/interfaces/activities-per-day.interface'
import type { FC } from 'react'
import { useAction } from 'shared/arch/hooks/use-action'
import chrono from 'shared/utils/chrono'

interface ICellContent {
  selectedMonth: Date
  borderBottom?: boolean
  activityDay: ActivitiesPerDay
}

export const CellContent: FC<ICellContent> = (props) => {
  const isOtherMonth = !chrono(props.activityDay.date).isSame(props.selectedMonth, 'month')

  const openCreateActivityForm = useAction(OpenCreateActivityFormAction)
  const handleOpenCreateActivityForm = async () => {
    await openCreateActivityForm(props.activityDay.date)
  }

  const bgOtherMonth = useColorModeValue('#f0f0f4', '#1d232f')
  const borderColor = useColorModeValue('gray.300', 'gray.700')
  const borderHoverColor = useColorModeValue('brand.700', 'gray.500')

  return (
    <Box
      position="relative"
      py="4px"
      px="8px"
      height="100%"
      cursor="pointer"
      border="1px solid transparent"
      bg={isOtherMonth ? bgOtherMonth : undefined}
      borderBottom={props.borderBottom ? '1px solid' : undefined}
      borderBottomColor={props.borderBottom ? borderColor : undefined}
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
