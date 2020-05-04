// @ts-ignore
import React, {Suspense} from "react"
import styles from "pages/binnacle/desktop/styles.module.css"
import TimeStats from "pages/binnacle/desktop/TimeStats"
import CalendarControls from "pages/binnacle/desktop/CalendarControls"
import CalendarGrid from "pages/binnacle/desktop/CalendarGrid/CalendarGrid"
import {SkipNavContent} from "core/components/SkipNavLink"
import {motion} from "framer-motion"
import {CalendarModal} from "pages/binnacle/desktop/CalendarModalContext"
import {CalendarResourcesProvider} from "pages/binnacle/desktop/CalendarResourcesContext"
import TimeStatsPlaceholder from "pages/placeholders/TimeStatsPlaceholder"
import CalendarPlaceholder from "pages/placeholders/CalendarPlaceholder"

const CalendarDesktop = () => {
  return (
    <motion.div
      initial={{
        opacity: 0
      }}
      animate={{ opacity: 1 }}
    >
      <CalendarResourcesProvider>
        <section className={styles.header}>
          <Suspense fallback={<TimeStatsPlaceholder />}>
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
      </CalendarResourcesProvider>
    </motion.div>
  );
};

export default CalendarDesktop;
