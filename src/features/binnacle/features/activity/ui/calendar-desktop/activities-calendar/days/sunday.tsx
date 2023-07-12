import { forwardRef } from 'react'
import { Day, DayProps } from './day'

export const Sunday = forwardRef<HTMLButtonElement, DayProps>((props, ref) => (
  <Day
    selectedDate={props.selectedDate}
    weekendDay={true}
    calendarData={props.calendarData}
    onClick={props.onClick}
    isSelected={props.isSelected}
    onEscKey={props.onEscKey}
    onActivityClicked={props.onActivityClicked}
    ref={ref}
  />
))

Sunday.displayName = 'Sunday'
