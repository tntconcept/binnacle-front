import React, { Suspense } from 'react'
import styles from 'pages/binnacle/BinnacleDesktopLayout/BinnacleDesktopLayout.module.css'
import CalendarControls from 'pages/binnacle/BinnacleDesktopLayout/CalendarControls'
import CalendarGrid from 'pages/binnacle/BinnacleDesktopLayout/CalendarGrid'
import { CalendarModal } from 'pages/binnacle/BinnacleDesktopLayout/CalendarModalContext'
import CalendarPlaceholder from 'pages/binnacle/BinnacleDesktopLayout/CalendarPlaceholder'
import { motion } from 'framer-motion'
import { SkipNavContent } from 'core/features/Navbar/SkipNavLink'
import { TimeBalance } from 'pages/binnacle/TimeBalance'
import TimeStatsPlaceholder from 'pages/binnacle/TimeBalance/TimeBalancePlaceholder'

export const BinnacleDesktopLayout = () => {
  return (
    <motion.div
      initial={{
        opacity: 0
      }}
      animate={{ opacity: 1 }}
      style={{
        height: 'calc(100% - 85px)'
      }}
    >
      <section className={styles.header}>
        <Suspense
          fallback={<TimeStatsPlaceholder />}
          // skips first render fallback, the outer suspense catches it. It's invisible the first time.
          unstable_avoidThisFallback={true}
        >
          <TimeBalance />
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
