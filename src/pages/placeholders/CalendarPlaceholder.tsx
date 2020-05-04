import React from 'react'
import styles from './Placeholders.module.css'
import {cls} from "utils/helpers"

const CalendarPlaceholder = () => {
  return (
    <div className={styles.calendar}>
      <div className={cls(styles.calendarHeader, styles.loading)} />
      {Array(24).fill(0).map(() => (
        <div className={styles.calendarCell} />
      ))}
    </div>
  )
}

export default CalendarPlaceholder