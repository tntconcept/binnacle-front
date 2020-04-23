import React, {Fragment} from "react"
import styles from "pages/binnacle/desktop/styles.module.css"
import TimeStats from "pages/binnacle/desktop/TimeStats"
import CalendarControls from "pages/binnacle/desktop/CalendarControls"
import CalendarGrid from "pages/binnacle/desktop/CalendarGrid/CalendarGrid"
import {SkipNavContent} from "core/components/SkipNavLink"

const CalendarDesktop = () => {
  return (
    <Fragment>
      <section className={styles.header}>
        <TimeStats />
        <CalendarControls />
      </section>
      <SkipNavContent id="calendar-content">
        <CalendarGrid />
      </SkipNavContent>
    </Fragment>
  );
};

export default CalendarDesktop;
