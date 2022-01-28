import { getWeekdaysName } from 'modules/binnacle/data-access/utils/getWeekdaysName'
import type { FC } from 'react'
import chrono from 'shared/utils/chrono'
import { cls } from 'shared/utils/helpers'

interface ICalendarWeekHeader {
  selectedDate: Date
}

const weekDays = getWeekdaysName()

const getWeekDay = (date: Date) => {
  const weekDay = chrono(date).get('weekday')
  return weekDay === 0 ? 7 : weekDay
}

const CalendarWeekHeader: FC<ICalendarWeekHeader> = (props) => {
  return (
    <div className="week-header">
      {weekDays.map((day, index) => (
        <span
          key={index}
          className={cls(
            'weekday',
            getWeekDay(props.selectedDate) === index + 1 && 'selected-weekday'
          )}
        >
          {day}
        </span>
      ))}
    </div>
  )
}

export default CalendarWeekHeader
