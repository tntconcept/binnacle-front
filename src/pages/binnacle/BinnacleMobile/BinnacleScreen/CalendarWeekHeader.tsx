import React from 'react'
import { cls } from 'core/utils/helpers'
import chrono from 'core/services/Chrono'
import 'pages/binnacle/BinnacleMobile/BinnacleScreen/CalendarWeek.css'
import { getWeekdaysName } from 'pages/binnacle/BinnaclePage.utils'

interface ICalendarWeekHeader {
  selectedDate: Date
}

const weekDays = getWeekdaysName()

const getWeekDay = (date: Date) => {
  const weekDay = chrono(date).get('weekday')
  return weekDay === 0 ? 7 : weekDay
}

const CalendarWeekHeader: React.FC<ICalendarWeekHeader> = (props) => {
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
