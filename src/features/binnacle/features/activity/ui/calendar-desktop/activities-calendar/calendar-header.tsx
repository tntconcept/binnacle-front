import { Text } from '@chakra-ui/react'
import type { FC } from 'react'
import { getWeekdaysName } from '../../../utils/getWeekdaysName'

const weekDaysName = getWeekdaysName()

const WeekDay: FC = (props) => {
  return (
    <Text
      as="span"
      textTransform="uppercase"
      fontSize="sm"
      alignSelf="center"
      justifySelf="center"
      aria-hidden
    >
      {props.children}
    </Text>
  )
}

const CalendarHeader: FC = () => {
  return (
    <>
      <WeekDay>{weekDaysName[0]}</WeekDay>
      <WeekDay>{weekDaysName[1]}</WeekDay>
      <WeekDay>{weekDaysName[2]}</WeekDay>
      <WeekDay>{weekDaysName[3]}</WeekDay>
      <WeekDay>{weekDaysName[4]}</WeekDay>
      <WeekDay>
        {weekDaysName[5]}/{weekDaysName[6]}
      </WeekDay>
    </>
  )
}

export default CalendarHeader
