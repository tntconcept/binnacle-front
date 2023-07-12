import { forwardRef } from 'react'
import { CellHeaderRefactor } from '../../calendar-cell/cell-header/cell-header-refactor'
import { HeaderProps } from '../leisure/header-props'

export const DefaultDay = forwardRef<HTMLButtonElement, HeaderProps>((props, ref) => (
  <CellHeaderRefactor
    ref={ref}
    date={props.date}
    time={props.time}
    selectedMonth={props.selectedMonth}
    activities={props.activities}
  />
))

DefaultDay.displayName = 'DefaultDay'
