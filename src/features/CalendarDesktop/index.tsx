import React, {Suspense} from "react"
import styles from "features/CalendarDesktop/styles.module.css"
import TimeStats from "features/TimeBalance/TimeStatsDesktop"
import CalendarControls from "features/CalendarDesktop/CalendarControls"
import CalendarGrid from "features/CalendarDesktop/CalendarGrid/CalendarGrid"
import {SkipNavContent} from "features/Navbar/SkipNavLink"
import {motion} from "framer-motion"
import {CalendarModal} from "features/CalendarDesktop/CalendarModalContext"
import CalendarPlaceholder from "features/CalendarDesktop/CalendarPlaceholder"
import TimeStatsDesktopPlaceholder from "features/TimeBalance/TimeStatsDesktopPlaceholder"

const CalendarDesktop = () => {
  return (
    <motion.div
      initial={{
        opacity: 0
      }}
      animate={{ opacity: 1 }}
    >
      <section className={styles.header}>
        <Suspense fallback={<TimeStatsDesktopPlaceholder />}>
          <TimeStats />
        </Suspense>
        <CalendarControls />
      </section>
      <Suspense
        fallback={<CalendarPlaceholder />}
        // skips first render fallback, the outer suspense catches it. It's invisible the first time.
        unstable_avoidThisFallback={true}
      >
        <SkipNavContent id="calendar-content">
          <CalendarModal>
            <CalendarGrid />
          </CalendarModal>
        </SkipNavContent>
      </Suspense>
    </motion.div>
  );
};

export default CalendarDesktop;
