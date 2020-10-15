import React from 'react'
import { getWeekdaysName } from 'utils/DateUtils'
import { Text } from '@chakra-ui/core'

const weekDaysName = getWeekdaysName()

const WeekDay: React.FC = (props) => {
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

const CalendarHeader: React.FC = () => {
  return (
    <React.Fragment>
      <WeekDay>{weekDaysName[0]}</WeekDay>
      <WeekDay>{weekDaysName[1]}</WeekDay>
      <WeekDay>{weekDaysName[2]}</WeekDay>
      <WeekDay>{weekDaysName[3]}</WeekDay>
      <WeekDay>{weekDaysName[4]}</WeekDay>
      <WeekDay>
        {weekDaysName[5]}/{weekDaysName[6]}
      </WeekDay>
    </React.Fragment>
  )
}

export default CalendarHeader
