import React, { Suspense } from "react";
import styles from "pages/binnacle/desktop/styles.module.css";
import TimeStats from "pages/binnacle/desktop/TimeStats";
import CalendarControls from "pages/binnacle/desktop/CalendarControls";
import CalendarGrid from "pages/binnacle/desktop/CalendarGrid/CalendarGrid";
import { SkipNavContent } from "core/components/SkipNavLink";
import { motion } from "framer-motion";
import { CalendarModal } from "pages/binnacle/desktop/CalendarModalContext";
import { AutentiaSpinner } from "core/components/LoadingLayout";

const CalendarDesktop = () => {
  return (
    <motion.div
      initial={{
        opacity: 0
      }}
      animate={{ opacity: 1 }}
    >
      <section className={styles.header}>
        <Suspense fallback={<AutentiaSpinner />}>
          <TimeStats />
        </Suspense>
        <CalendarControls />
      </section>
      <SkipNavContent id="calendar-content">
        <CalendarModal>
          <Suspense fallback={<AutentiaSpinner />}>
            <CalendarGrid />
          </Suspense>
        </CalendarModal>
      </SkipNavContent>
    </motion.div>
  );
};

export default CalendarDesktop;
