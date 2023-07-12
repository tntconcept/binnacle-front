import { forwardRef } from 'react'
import { Day, DayProps } from './day'

type Props = Omit<DayProps, 'weekendDay'>

export const Weekday = forwardRef<HTMLButtonElement, Props>((props, ref) => (
  <Day
    selectedDate={props.selectedDate}
    calendarData={props.calendarData}
    onClick={props.onClick}
    weekendDay={false}
    isSelected={props.isSelected}
    onEscKey={props.onEscKey}
    onActivityClicked={props.onActivityClicked}
    ref={ref}
  />
))

Weekday.displayName = 'Weekday'
