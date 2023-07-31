import { forwardRef } from 'react'
import { Day, DayProps } from './day'

type Props = Omit<DayProps, 'weekendDay'>

export const Sunday = forwardRef<HTMLButtonElement, Props>((props, ref) => (
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
