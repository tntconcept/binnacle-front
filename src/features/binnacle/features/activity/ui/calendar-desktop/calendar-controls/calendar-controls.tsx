import { Flex } from '@chakra-ui/react'
import { CalendarPicker } from './calendar-picker/calendar-picker'
import { NextMonthArrow } from './next-month-arrow'
import { PrevMonthArrow } from './prev-month-arrow'
import { TodayButton } from './today-button'

export const CalendarControls = () => {
  return (
    <Flex align="center" gap={5}>
      <CalendarPicker />
      <Flex align="center">
        <PrevMonthArrow />
        <NextMonthArrow />
      </Flex>
      <TodayButton />
    </Flex>
  )
}
