import React from 'react'
import styles from 'pages/binnacle/BinnacleMobileLayout/CalendarWeek.module.css'
import { cls } from 'utils/helpers'
import { getWeekdaysName } from 'utils/DateUtils'
import chrono from 'services/Chrono'

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
    <div className={styles.weekHeader}>
      {weekDays.map((day, index) => (
        <span
          key={index}
          className={cls(
            styles.weekDay,
            getWeekDay(props.selectedDate) === index + 1 && styles.selectedWeekDay
          )}
        >
          {day}
        </span>
      ))}
    </div>
  )
}

export default CalendarWeekHeader
