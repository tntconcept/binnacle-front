import { Box, Flex } from '@chakra-ui/react'
import { GetCalendarDataAction } from 'modules/binnacle/data-access/actions/get-calendar-data-action'
import { CalendarControls } from 'modules/binnacle/page/BinnacleDesktop/CalendarControls/CalendarControls'
import { ActivitiesCalendar } from 'modules/binnacle/page/BinnacleDesktop/ActivitiesCalendar/ActivitiesCalendar'
import { CalendarSkeleton } from 'modules/binnacle/page/BinnacleDesktop/ActivitiesCalendar/CalendarSkeleton'
import { ActivityModal } from 'modules/binnacle/page/BinnacleDesktop/ActivityModal/ActivityModal'
import { Fragment } from 'react'
import { useActionOnMount } from 'shared/arch/hooks/use-action-on-mount'
import { SkipNavContent, SkipNavLink } from 'shared/components/Navbar/SkipNavLink'
import { WorkingTimeSkeleton } from '../../components/WorkingTime/WorkingTimeSkeleton'
import { WorkingTime } from '../../components/WorkingTime/WorkingTime'

const BinnacleDesktop = () => {
  const isLoading = useActionOnMount(GetCalendarDataAction)

  return (
    <Fragment>
      <SkipNavLink contentId="calendar-content" />
      <Box as="main" overflowY="hidden">
        <Flex
          as="section"
          align="center"
          justify="space-between"
          border="none"
          margin="0 32px 16px 34px"
        >
          {isLoading ? <WorkingTimeSkeleton /> : <WorkingTime />}
          <CalendarControls />
        </Flex>
        {isLoading ? (
          <CalendarSkeleton />
        ) : (
          <SkipNavContent id="calendar-content">
            <ActivitiesCalendar />
          </SkipNavContent>
        )}
      </Box>
      <ActivityModal />
    </Fragment>
  )
}

export default BinnacleDesktop
