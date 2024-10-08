import { forwardRef } from 'react'
import { Day, DayProps } from './day'

type Props = Omit<DayProps, 'weekendDay'>

export const Saturday = forwardRef<HTMLButtonElement, Props>((props, ref) => (
  <Day
    selectedDate={props.selectedDate}
    calendarData={props.calendarData}
    onClick={props.onClick}
    isSelected={props.isSelected}
    weekendDay={true}
    borderBottom={true}
    onEscKey={props.onEscKey}
    onActivityClicked={props.onActivityClicked}
    ref={ref}
  />
))

Saturday.displayName = 'Saturday'
