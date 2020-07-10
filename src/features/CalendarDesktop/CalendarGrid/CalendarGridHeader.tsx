import React from 'react'
import styles from 'features/CalendarDesktop/CalendarGrid/CalendarGrid.module.css'
import { getWeekdaysName } from 'utils/DateUtils'
import { useSettings } from 'features/Settings/useSettings'

const weekDaysName = getWeekdaysName()

interface ICalendarGridHeader {
  hideWeekend: boolean
}

const CalendarGridHeader: React.FC<ICalendarGridHeader> = ({ hideWeekend }) => {
  const { state } = useSettings()

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
      </span>
      {!hideWeekend && (
        <span
          aria-hidden
          className={styles.weekDay}>
          {state.hideSaturday
            ? weekDaysName[6]
            : state.hideSunday
              ? weekDaysName[5]
              : `${weekDaysName[5]}/${weekDaysName[6]}`}
        </span>
      )}
    </React.Fragment>
  )
}

export default CalendarGridHeader
