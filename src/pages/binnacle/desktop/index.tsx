// @ts-ignore
import React, {Suspense, useState} from "react"
import styles from "pages/binnacle/desktop/styles.module.css"
import TimeStats from "pages/binnacle/desktop/TimeStats"
import CalendarControls from "pages/binnacle/desktop/CalendarControls"
import CalendarGrid from "pages/binnacle/desktop/CalendarGrid/CalendarGrid"
import {SkipNavContent} from "core/components/SkipNavLink"
import {motion} from "framer-motion"
import {CalendarModal} from "pages/binnacle/desktop/CalendarModalContext"
import {AutentiaSpinner} from "core/components/LoadingLayout"
import {CalendarResources, wrapPromise} from "api/CacheSystem/CalendarResources"

const initialTimeResource = wrapPromise(
  CalendarResources.fetchTimeData(new Date())
);
const initialCalendarDataResources = wrapPromise(
  CalendarResources.fetchCalendarData(new Date())
);

const CalendarDesktop = () => {
  const [timeResource, setTimeResource] = useState(initialTimeResource);
  const [calendarResources, setCalendarResources] = useState(
    initialCalendarDataResources
  );

  return (
    <motion.div
      initial={{
        opacity: 0
      }}
      animate={{ opacity: 1 }}
    >
      <section className={styles.header}>
        <Suspense fallback={<AutentiaSpinner />}>
          <TimeStats resource={timeResource} />
        </Suspense>
        <CalendarControls
          onMonthChange={month => {
            setTimeResource(
              wrapPromise(CalendarResources.fetchTimeData(month))
            );
            setCalendarResources(
              wrapPromise(CalendarResources.fetchCalendarData(month))
            );
          }}
        />
      </section>
      <Suspense
        fallback={<AutentiaSpinner />}
        // skips first render fallback, the outer suspense catches it. It's invisible the first time.
        unstable_avoidThisFallback={true}
      >
        <SkipNavContent id="calendar-content">
          <CalendarModal>
            <CalendarGrid resource={calendarResources} />
          </CalendarModal>
        </SkipNavContent>
      </Suspense>
    </motion.div>
  );
};

export default CalendarDesktop;
