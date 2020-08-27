import React, { useRef } from 'react'
import { useDay } from '@datepicker-react/hooks'
import { isPrivateHoliday, isPublicHoliday } from 'utils/DateUtils'
import { Button } from '@chakra-ui/core'
import { IHolidays, PrivateHolidayState } from 'api/interfaces/IHolidays'
import { addDays } from 'date-fns'

const holidays: IHolidays = {
  publicHolidays: [
    { compensation: true, date: addDays(new Date(), 1), description: 'Fiesta' }
  ],
  privateHolidays: [
    {
      state: PrivateHolidayState.Accept,
      days: [addDays(new Date(), 2)],
      chargeYear: new Date()
    }
  ]
}

interface DayValues {
  date: Date
  focusedDate: Date | null
  isDateFocused(date: Date): boolean
  isDateSelected(date: Date): boolean
  isDateHovered(date: Date): boolean
  isDateBlocked(date: Date): boolean
  isFirstOrLastSelectedDate(date: Date): boolean
  onDateFocus(date: Date): void
  onDateSelect(date: Date): void
  onDateHover(date: Date): void
}

interface Props {
  day: string
  values: DayValues
}

export function Day(props: Props) {
  const dayRef = useRef(null)

  const {
    disabledDate,
    isSelected,
    isSelectedStartOrEnd,
    onClick,
    onKeyDown,
    onMouseEnter,
    tabIndex
  } = useDay({
    ...props.values,
    dayRef
  })

  if (!props.day) {
    return <div />
  }

  const isS = isSelected || isSelectedStartOrEnd

  const getColor = () => {
    const isPublicHday = isPublicHoliday(holidays.publicHolidays, props.values.date)
    const isPrivateHday = isPrivateHoliday(
      holidays.privateHolidays,
      props.values.date
    )

    if (isPublicHday) {
      return '#ecbd00'
    } else if (isPrivateHday) {
      return '#3381ff'
    } else {
      return undefined
    }
  }

  const getBgColor = () => {
    if (isS) {
      return getColor() || '#2c5ae3'
    } else {
      return 'inherit'
    }
  }

  return (
    <Button
      isDisabled={disabledDate}
      variant="ghost"
      onClick={onClick}
      onKeyDown={onKeyDown}
      onMouseEnter={onMouseEnter}
      tabIndex={tabIndex}
      type="button"
      ref={dayRef}
      color={!isS ? getColor() : undefined}
      bgColor={getBgColor()}
      data-testid={isSelected || isSelectedStartOrEnd ? 'is-selected' : undefined}
      borderRadius={0}
    >
      {props.day}
    </Button>
  )
}
