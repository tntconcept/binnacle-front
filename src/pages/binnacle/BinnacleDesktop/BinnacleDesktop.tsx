import React, { Fragment, Suspense } from 'react'
import CalendarControls from 'pages/binnacle/BinnacleDesktop/CalendarControls'
import CalendarGrid from 'pages/binnacle/BinnacleDesktop/CalendarGrid'
import { CalendarModal } from 'pages/binnacle/BinnacleDesktop/CalendarModalContext'
import CalendarSkeleton from 'pages/binnacle/BinnacleDesktop/CalendarSkeleton'
import { motion } from 'framer-motion'
import SkipNavLink, { SkipNavContent } from 'core/components/Navbar/SkipNavLink'
import TimeBalanceSkeleton from 'pages/binnacle/TimeBalance/TimeBalanceSkeleton'
import { Flex } from '@chakra-ui/core'
import { TimeBalance } from '../TimeBalance/TimeBalance'
import Navbar from 'core/components/Navbar/Navbar'

const BinnacleDesktop = () => {
  return (
    <Fragment>
      <SkipNavLink contentId="calendar-content" />
      <Navbar />
      <motion.main
        initial={{
          opacity: 0
        }}
        animate={{ opacity: 1 }}
        style={{
          height: 'calc(100% - 85px)'
        }}
      >
        <Flex
          as="section"
          align="center"
          justify="space-between"
          border="none"
          margin="0 32px 16px 34px"
        >
          <Suspense
            fallback={<TimeBalanceSkeleton />}
            // skips first render fallback, the outer suspense catches it. It's invisible the first time.
            unstable_avoidThisFallback={true}
          >
            <TimeBalance />
          </Suspense>
          <CalendarControls />
        </Flex>
        <Suspense
          fallback={<CalendarSkeleton />}
          // skips first render fallback, the outer suspense catches it. It's invisible the first time.
          unstable_avoidThisFallback={true}
        >
          <SkipNavContent id="calendar-content" style={{ height: 'calc(100% - 85px)' }}>
            <CalendarModal>
              <CalendarGrid />
            </CalendarModal>
          </SkipNavContent>
        </Suspense>
      </motion.main>
    </Fragment>
  )
}

export default BinnacleDesktop
