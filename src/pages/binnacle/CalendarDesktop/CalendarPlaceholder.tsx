import React from 'react'
import styles from 'pages/binnacle/CalendarDesktop/CalendarPlaceholder.module.css'
import { cls } from 'utils/helpers'

const CalendarPlaceholder = () => {
  return (
    <div
      className={styles.calendar}
      data-testid="calendar_placeholder">
      <div className={cls(styles.calendarHeader, 'loading-placeholder')} />
      {Array(24)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className={styles.calendarCell} />
        ))}
    </div>
  )
}

export default CalendarPlaceholder
