import { Box, Flex } from '@chakra-ui/react'
import { Fragment, useMemo } from 'react'
import { SkipNavLink } from 'shared/components/Navbar/SkipNavLink'
import { TimeSummary } from '../components/time-summary/time-summary'
import { ActivitiesCalendar } from './activities-calendar/activities-calendar'
import { CalendarControls } from './calendar-controls/calendar-controls'
import { useCalendarContext } from '../contexts/calendar-context'
import { firstDayOfFirstWeekOfMonth } from '../../utils/firstDayOfFirstWeekOfMonth'
import { lastDayOfLastWeekOfMonth } from '../../utils/lastDayOfLastWeekOfMonth'
import { useExecuteUseCaseOnMount } from '../../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { GetCalendarDataQry } from '../../application/get-calendar-data-qry'
import { useSubscribeToUseCase } from '../../../../../../shared/arch/hooks/use-subscribe-to-use-case'
import { CreateActivityCmd } from '../../application/create-activity-cmd'
import { UpdateActivityCmd } from '../../application/update-activity-cmd'
import { DeleteActivityCmd } from '../../application/delete-activity-cmd'

const CalendarDesktop = () => {
  const { selectedDate } = useCalendarContext()
  const selectedDateInterval = useMemo(() => {
    const start = firstDayOfFirstWeekOfMonth(selectedDate)
    const end = lastDayOfLastWeekOfMonth(selectedDate)

    return { start, end }
  }, [selectedDate])

  const {
    isLoading: isLoadingCalendarData,
    result: calendarData = [],
    executeUseCase: getCalendarDataQry
  } = useExecuteUseCaseOnMount(GetCalendarDataQry, selectedDateInterval)

  useSubscribeToUseCase(
    CreateActivityCmd,
    () => {
      getCalendarDataQry(selectedDateInterval)
    },
    [selectedDateInterval]
  )

  useSubscribeToUseCase(
    UpdateActivityCmd,
    () => {
      getCalendarDataQry(selectedDateInterval)
    },
    [selectedDateInterval]
  )

  useSubscribeToUseCase(
    DeleteActivityCmd,
    () => {
      getCalendarDataQry(selectedDateInterval)
    },
    [selectedDateInterval]
  )
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
        <ActivitiesCalendar
          calendarData={calendarData}
          isLoadingCalendarData={isLoadingCalendarData}
          selectedDate={selectedDate}
        />
      </Box>
    </Fragment>
  )
}

export default CalendarDesktop
