import React from 'react'
import styles from './CalendarWeek.module.css'
import { cls } from 'utils/helpers'
import { getDay } from 'date-fns'
import { getWeekdaysName } from 'utils/DateUtils'

interface ICalendarWeekHeader {
  selectedDate: Date
}

const weekDays = getWeekdaysName()

const getWeekDay = (date: Date) => {
  const weekDay = getDay(date)
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
