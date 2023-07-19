import { Box, Flex } from '@chakra-ui/react'
import { FC, Fragment, useMemo } from 'react'
import { SkipNavLink } from '../../../../../../shared/components/navbar/skip-nav-link'
import { useExecuteUseCaseOnMount } from '../../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { useSubscribeToUseCase } from '../../../../../../shared/arch/hooks/use-subscribe-to-use-case'
import { ApproveActivityCmd } from '../../application/approve-activity-cmd'
import { CreateActivityCmd } from '../../application/create-activity-cmd'
import { DeleteActivityCmd } from '../../application/delete-activity-cmd'
import { GetCalendarDataQry } from '../../application/get-calendar-data-qry'
import { UpdateActivityCmd } from '../../application/update-activity-cmd'
import { firstDayOfFirstWeekOfMonth } from '../../utils/first-day-of-first-week-of-month'
import { lastDayOfLastWeekOfMonth } from '../../utils/last-day-of-last-week-of-month'
import { TimeSummary } from '../components/time-summary/time-summary'
import { useCalendarContext } from '../contexts/calendar-context'
import { ActivitiesCalendar } from './activities-calendar/activities-calendar'
import { CalendarControls } from './calendar-controls/calendar-controls'

export const CalendarDesktop: FC = () => {
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

  useSubscribeToUseCase(
    ApproveActivityCmd,
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
