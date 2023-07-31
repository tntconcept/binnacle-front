import { forwardRef } from 'react'
import { CellHeader } from '../cell-header'
import { CellHeaderProps } from '../cell-header-props'

export const DefaultDay = forwardRef<HTMLButtonElement, CellHeaderProps>((props, ref) => (
  <CellHeader
    ref={ref}
    date={props.date}
    time={props.time}
    selectedMonth={props.selectedMonth}
    activities={props.activities}
  />
))

DefaultDay.displayName = 'DefaultDay'
