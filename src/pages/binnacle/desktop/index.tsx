import React, {Fragment} from 'react'
import styles from "pages/binnacle/desktop/styles.module.css"
import TimeStats from "pages/binnacle/desktop/TimeStats"
import CalendarControls from "pages/binnacle/desktop/CalendarControls"
import CalendarGrid from "pages/binnacle/desktop/CalendarGrid/CalendarGrid"

const CalendarDesktop = () => {
  return (
    <Fragment>
      <section
        className={styles.header}
        aria-label="Calendar controls"
      >
        <TimeStats />
        <CalendarControls />
      </section>
      <CalendarGrid />
    </Fragment>
  )
}

export default CalendarDesktop
