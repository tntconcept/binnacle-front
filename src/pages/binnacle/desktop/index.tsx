import React from "react"
import styles from "pages/binnacle/desktop/styles.module.css"
import TimeStats from "pages/binnacle/desktop/TimeStats"
import CalendarControls from "pages/binnacle/desktop/CalendarControls"
import CalendarGrid from "pages/binnacle/desktop/CalendarGrid/CalendarGrid"
import {SkipNavContent} from "core/components/SkipNavLink"
import {motion} from "framer-motion"

const CalendarDesktop = () => {
  return (
    <motion.div
      initial={{
        opacity: 0
      }}
      animate={{ opacity: 1 }}
    >
      <section className={styles.header}>
        <TimeStats />
        <CalendarControls />
      </section>
      <SkipNavContent id="calendar-content">
        <CalendarGrid />
      </SkipNavContent>
    </motion.div>
  );
};

export default CalendarDesktop;
