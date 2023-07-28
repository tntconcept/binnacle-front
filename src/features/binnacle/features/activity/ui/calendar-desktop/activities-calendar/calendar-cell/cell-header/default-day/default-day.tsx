import { forwardRef } from 'react'
import { CellHeaderRefactor } from '../cell-header-refactor'
import { CellHeaderProps } from '../cell-header-props'

export const DefaultDay = forwardRef<HTMLButtonElement, CellHeaderProps>((props, ref) => (
  <CellHeaderRefactor
    ref={ref}
    date={props.date}
    time={props.time}
    selectedMonth={props.selectedMonth}
    activities={props.activities}
  />
))

DefaultDay.displayName = 'DefaultDay'
