import React from 'react'
import styles from 'features/CalendarDesktop/CalendarGrid/CalendarGrid.module.css'
import { getWeekdaysName } from 'utils/DateUtils'

const weekDaysName = getWeekdaysName()

const CalendarGridHeader: React.FC = () => {
  return (
    <React.Fragment>
      <span
        aria-hidden
        className={styles.weekDay}>
        {weekDaysName[0]}
      </span>
      <span
        aria-hidden
        className={styles.weekDay}>
        {weekDaysName[1]}
      </span>
      <span
        aria-hidden
        className={styles.weekDay}>
        {weekDaysName[2]}
      </span>
      <span
        aria-hidden
        className={styles.weekDay}>
        {weekDaysName[3]}
      </span>
      <span
        aria-hidden
        className={styles.weekDay}>
        {weekDaysName[4]}
      </span>{' '}
      <span
        aria-hidden
        className={styles.weekDay}>
        {weekDaysName[5]}/{weekDaysName[6]}
      </span>
    </React.Fragment>
  )
}

export default CalendarGridHeader
