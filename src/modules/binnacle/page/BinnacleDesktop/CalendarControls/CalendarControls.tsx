import { Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react'
import { BinnacleState } from 'modules/binnacle/data-access/state/binnacle-state'
import { NextMonthArrow } from 'modules/binnacle/page/BinnacleDesktop/CalendarControls/NextMonthArrow'
import { PrevMonthArrow } from 'modules/binnacle/page/BinnacleDesktop/CalendarControls/PrevMonthArrow'
import { useGlobalState } from 'shared/arch/hooks/use-global-state'
import { CalendarPicker } from './CalendarPicker/CalendarPicker'

export const CalendarControls = observer(() => {
  const { selectedDate } = useGlobalState(BinnacleState)

  return (
    <Flex align="center">
      <CalendarPicker selectedDate={selectedDate} />
      <PrevMonthArrow selectedDate={selectedDate} />
      <NextMonthArrow selectedDate={selectedDate} />
    </Flex>
  )
})
