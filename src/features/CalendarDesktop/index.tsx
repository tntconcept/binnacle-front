import React, { Suspense } from 'react'
import styles from './styles.module.css'
import CalendarControls from './CalendarControls'
import CalendarGrid from './CalendarGrid'
import { CalendarModal } from './CalendarModalContext'
import CalendarPlaceholder from './CalendarPlaceholder'
import { motion } from 'framer-motion'
import { SkipNavContent } from 'features/Navbar/SkipNavLink'
import TimeStats from 'features/TimeBalance/TimeStats'
import TimeStatsPlaceholder from 'features/TimeBalance/TimeStatsPlaceholder'

const CalendarDesktop = () => {
  return (
    <motion.div
      initial={{
        opacity: 0
      }}
      animate={{ opacity: 1 }}
    >
      <section className={styles.header}>
        <Suspense
          fallback={<TimeStatsPlaceholder />}
          // skips first render fallback, the outer suspense catches it. It's invisible the first time.
          unstable_avoidThisFallback={true}
        >
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
  )
}

export default CalendarDesktop
