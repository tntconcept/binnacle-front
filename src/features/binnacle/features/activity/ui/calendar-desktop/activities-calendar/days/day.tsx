import { Activity } from '../../../../domain/activity'
import { CellContent } from '../calendar-cell/cell-content/cell-content'
import { CellBody } from '../calendar-cell/cell-body/cell-body'
import { forwardRef } from 'react'
import { CalendarDatum } from '../../../../domain/calendar-datum'
import { createCellHeaderComponentFactory } from '../calendar-cell/cell-header/cell-header-factory'
import { CalendarCellBlock } from '../calendar-cell/calendar-cell-block'

export interface DayProps {
  selectedDate: Date
  calendarData: CalendarDatum
  borderBottom?: boolean
  weekendDay: boolean
  isSelected: boolean
  onClick: (selectedDate: Date) => void
  onEscKey: () => void
  onActivityClicked: (activity: Activity) => void
}

export const Day = forwardRef<HTMLButtonElement, DayProps>((props, ref) => {
  return (
    <CalendarCellBlock noBorderRight={props.weekendDay}>
      <CellContent
        key={props.calendarData.date.toISOString()}
        selectedMonth={props.selectedDate}
        borderBottom={props.borderBottom}
        activityDaySummary={props.calendarData}
        onClick={props.onClick}
        isWeekendDay={props.weekendDay}
      >
        {createCellHeaderComponentFactory().createComponent({
          ref,
          activities: props.calendarData.activities,
          date: props.calendarData.date,
          selectedMonth: props.selectedDate,
          time: props.calendarData.worked,
          holiday: props.calendarData.holiday,
          vacation: props.calendarData.vacation
        })}
        <CellBody
          onEscKey={props.onEscKey}
          onActivityClicked={props.onActivityClicked}
          isSelected={props.isSelected}
          activities={props.calendarData.activities}
        />
      </CellContent>
    </CalendarCellBlock>
  )
})

Day.displayName = 'Day'
