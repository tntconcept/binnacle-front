import { Flex } from '@chakra-ui/react'
import { CalendarPicker } from './calendar-picker/calendar-picker'
import { NextMonthArrow } from './next-month-arrow'
import { PrevMonthArrow } from './prev-month-arrow'
import { TodayButton } from './today-button'
import { useIsMobile } from '../../../../../../../shared/hooks/use-is-mobile'

export const CalendarControls = () => {
  const isMobile = useIsMobile()
  return (
    <Flex
      align={'center'}
      width={isMobile ? '100%' : 'inherit'}
      justify={isMobile ? 'end' : 'center'}
      gap={isMobile ? 1 : 5}
    >
      <CalendarPicker />
      <Flex align="center">
        <PrevMonthArrow />
        <NextMonthArrow />
      </Flex>
      <TodayButton />
    </Flex>
  )
}
