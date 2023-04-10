import { Box, Flex } from '@chakra-ui/react'
import { Fragment } from 'react'
import { SkipNavLink } from 'shared/components/Navbar/SkipNavLink'
import { TimeSummary } from '../components/time-summary/time-summary'
import { ActivitiesCalendar } from './activities-calendar/activities-calendar'
import { CalendarControls } from './calendar-controls/calendar-controls'

const CalendarDesktop = () => {
  return (
    <Fragment>
      <SkipNavLink contentId="calendar-content" />
      <Box as="main" height="calc(100% - 65px - 32px)" display="flex" flexDirection="column">
        <Flex
          as="section"
          align="center"
          justify="space-between"
          border="none"
          margin="0 32px 16px 34px"
        >
          <TimeSummary />
          <CalendarControls />
        </Flex>
        <ActivitiesCalendar />
      </Box>
    </Fragment>
  )
}

export default CalendarDesktop
