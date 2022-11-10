import { Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react'
import { BinnacleState } from 'modules/binnacle/data-access/state/binnacle-state'
import { NextMonthArrow } from 'modules/binnacle/page/BinnacleDesktop/CalendarControls/NextMonthArrow'
import { PrevMonthArrow } from 'modules/binnacle/page/BinnacleDesktop/CalendarControls/PrevMonthArrow'
import { useGlobalState } from 'shared/arch/hooks/use-global-state'
import { CalendarPicker } from './CalendarPicker/CalendarPicker'
import { TodayButton } from './TodayButton'

export const CalendarControls = observer(() => {
  const { selectedDate } = useGlobalState(BinnacleState)

  return (
    <Flex align="center" gap={5}>
      <CalendarPicker selectedDate={selectedDate} />
      <Flex align="center">
        <PrevMonthArrow selectedDate={selectedDate} />
        <NextMonthArrow selectedDate={selectedDate} />
      </Flex>
      <TodayButton selectedDate={selectedDate} />
    </Flex>
  )
})
