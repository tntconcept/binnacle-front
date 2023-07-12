import { forwardRef } from 'react'
import { DayProps } from './day'
import { Saturday } from './saturday'
import { Sunday } from './sunday'

type Props = Omit<DayProps, 'weekendDay'>

export const Weekend = forwardRef<HTMLButtonElement, Props>((props, ref) => (
  <>
    <Saturday
      selectedDate={props.selectedDate}
      calendarData={props.calendarData}
      onClick={props.onClick}
      weekendDay={true}
      borderBottom={true}
      isSelected={props.isSelected}
      onEscKey={props.onEscKey}
      onActivityClicked={props.onActivityClicked}
      ref={ref}
    />
    <Sunday
      selectedDate={props.selectedDate}
      calendarData={props.calendarData}
      onClick={props.onClick}
      weekendDay={true}
      isSelected={props.isSelected}
      onEscKey={props.onEscKey}
      onActivityClicked={props.onActivityClicked}
      ref={ref}
    />
  </>
))

Weekend.displayName = 'Weekend'
