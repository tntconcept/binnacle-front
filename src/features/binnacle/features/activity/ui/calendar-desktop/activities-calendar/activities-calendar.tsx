import { Grid, useColorModeValue } from '@chakra-ui/react'
import { GetHolidaysQry } from 'features/binnacle/features/holiday/application/get-holidays-qry'
import { GetAllVacationsForDateIntervalQry } from 'features/binnacle/features/vacation/application/get-all-vacations-for-date-interval-qry'
import { forwardRef, useMemo, useState } from 'react'
import { useExecuteUseCaseOnMount } from 'shared/arch/hooks/use-execute-use-case-on-mount'
import { useSubscribeToUseCase } from 'shared/arch/hooks/use-subscribe-to-use-case'
import { SkipNavContent } from 'shared/components/Navbar/SkipNavLink'
import { TimeUnits } from 'shared/types/time-unit'
import chrono, { getWeeksInMonth, isSaturday, isSunday } from 'shared/utils/chrono'
import { CreateActivityCmd } from '../../../application/create-activity-cmd'
import { DeleteActivityCmd } from '../../../application/delete-activity-cmd'
import { GetActivitiesQry } from '../../../application/get-activities-qry'
import { GetActivitySummaryQry } from '../../../application/get-activity-summary-qry'
import { UpdateActivityCmd } from '../../../application/update-activity-cmd'
import { Activity } from '../../../domain/activity'
import { ActivityDaySummary } from '../../../domain/activity-day-summary'
import { firstDayOfFirstWeekOfMonth } from '../../../utils/firstDayOfFirstWeekOfMonth'
import { getHoliday } from '../../../utils/getHoliday'
import { getVacation } from '../../../utils/getVacation'
import { lastDayOfLastWeekOfMonth } from '../../../utils/lastDayOfLastWeekOfMonth'
import { ActivityModal } from '../../components/activity-modal/activity-modal'
import { useCalendarContext } from '../../contexts/calendar-context'
import { CalendarCellBlock } from './calendar-cell/calendar-cell-block'
import { CellBody } from './calendar-cell/cell-body/cell-body'
import { CellContent } from './calendar-cell/cell-content/cell-content'
import { CellHeader } from './calendar-cell/cell-header/cell-header'
import CalendarHeader from './calendar-header'
import { CalendarSkeleton } from './calendar-skeleton'
import { ActivityWithRenderDays } from './types/activity-with-render-days'
import { useCalendarKeysNavigation } from './useCalendarKeyboardNavigation'

export const ActivitiesCalendar = () => {
  const { selectedDate } = useCalendarContext()
  const selectedDateInterval = useMemo(() => {
    const start = firstDayOfFirstWeekOfMonth(selectedDate)
    const end = lastDayOfLastWeekOfMonth(selectedDate)

    return { start, end }
  }, [selectedDate])

  const [activityDate, setActivityDate] = useState(new Date())
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>()
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [selectedCell, setSelectedCell] = useState<number | null>(null)
  const { calendarRef, registerCellRef } = useCalendarKeysNavigation(selectedDate, setSelectedCell)

  const {
    isLoading: isLoadingActivities,
    result: activities,
    executeUseCase: getActivitiesQry
  } = useExecuteUseCaseOnMount(GetActivitiesQry, selectedDateInterval)

  const {
    isLoading: isLoadingDaySummary,
    result: activitiesDaySummary,
    executeUseCase: getActivitySummaryQry
  } = useExecuteUseCaseOnMount(GetActivitySummaryQry, selectedDateInterval)

  const { isLoading: isLoadingHolidays, result: holidays } = useExecuteUseCaseOnMount(
    GetHolidaysQry,
    selectedDateInterval
  )
  const { isLoading: isLoadingVacations, result: vacations } = useExecuteUseCaseOnMount(
    GetAllVacationsForDateIntervalQry,
    selectedDateInterval
  )

  useSubscribeToUseCase(
    CreateActivityCmd,
    () => {
      getActivitiesQry(selectedDateInterval)
      getActivitySummaryQry(selectedDateInterval)
    },
    [selectedDateInterval]
  )

  useSubscribeToUseCase(
    UpdateActivityCmd,
    () => {
      getActivitiesQry(selectedDateInterval)
      getActivitySummaryQry(selectedDateInterval)
    },
    [selectedDateInterval]
  )

  useSubscribeToUseCase(
    DeleteActivityCmd,
    () => {
      getActivitiesQry(selectedDateInterval)
      getActivitySummaryQry(selectedDateInterval)
    },
    [selectedDateInterval]
  )

  const isLoading = useMemo(
    () => isLoadingDaySummary || isLoadingActivities || isLoadingHolidays || isLoadingVacations,
    [isLoadingDaySummary, isLoadingActivities, isLoadingHolidays, isLoadingVacations]
  )

  const activitiesInDays = useMemo(() => {
    if (!activities) return []

    return activities.filter((a) => a.interval.timeUnit === TimeUnits.DAYS)
  }, [activities])

  const activitiesInMinutes = useMemo(() => {
    if (!activities) return []

    return activities.filter((a) => a.interval.timeUnit === TimeUnits.MINUTES)
  }, [activities])

  const getActivitiesByDate = (date: Date): ActivityWithRenderDays[] => {
    const activities: ActivityWithRenderDays[] = []
    const chronoDate = chrono(date)
    let renderIndex = 0

    activitiesInDays.forEach((activity) => {
      const { interval } = activity
      const dateIsWithinActivityInterval = chronoDate.isBetween(interval.start, interval.end)
      if (!dateIsWithinActivityInterval) return

      const isStartDay = chronoDate.isSameDay(activity.interval.start)
      const weekday = chronoDate.get('weekday')
      const isMonday = weekday === 1
      if (!isStartDay && !isMonday) {
        renderIndex++
        return
      }

      const daysToEndDate = chronoDate.diffCalendarDays(activity.interval.end) * -1 + 1
      const daysToPaint = 5 - weekday + 1
      const renderDays = daysToEndDate > daysToPaint ? daysToPaint : daysToEndDate

      activities.push({
        ...activity,
        renderDays,
        renderIndex: renderIndex++
      })
    })

    activitiesInMinutes.forEach((activity) => {
      const isSameDay = chronoDate.isSameDay(activity.interval.start)
      if (isSameDay) {
        activities.push({
          ...activity,
          renderDays: 1,
          renderIndex: renderIndex++
        })
      }
    })

    return activities
  }

  const addActivity = (date: Date) => {
    setSelectedActivity(undefined)
    setActivityDate(date)
    setShowActivityModal(true)
  }

  const editActivity = (activity: Activity) => {
    setActivityDate(activity.interval.start)
    setSelectedActivity(activity)
    setShowActivityModal(true)
  }

  const onCloseActivity = () => {
    setShowActivityModal(false)
  }

  return (
    <>
      {isLoading ? (
        <CalendarSkeleton />
      ) : (
        <SkipNavContent id="calendar-content" style={{ flexGrow: '1' }}>
          <CalendarContainer ref={calendarRef}>
            <CalendarHeader />
            {activitiesDaySummary &&
              activitiesDaySummary.map((activityDaySummary: ActivityDaySummary, index: number) => {
                const activities = getActivitiesByDate(activityDaySummary.date)
                const holiday = getHoliday(holidays || [], activityDaySummary.date)
                const vacation = getVacation(vacations || [], activityDaySummary.date)

                if (isSunday(activityDaySummary.date)) {
                  return null
                }

                const shouldRenderWeekendCells = isSaturday(activityDaySummary.date)

                return (
                  <CalendarCellBlock
                    key={activityDaySummary.date.getTime() + index}
                    noBorderRight={shouldRenderWeekendCells}
                  >
                    {shouldRenderWeekendCells ? (
                      // Weekend cells
                      <>
                        <CellContent
                          key={index}
                          selectedMonth={selectedDate}
                          borderBottom={true}
                          activityDaySummary={activityDaySummary}
                          onClick={addActivity}
                        >
                          <CellHeader
                            selectedMonth={selectedDate}
                            holiday={holiday}
                            vacation={vacation}
                            activities={activities}
                            date={activityDaySummary.date}
                            time={activityDaySummary.worked}
                            ref={registerCellRef(index)}
                          />
                          <CellBody
                            isSelected={selectedCell === index}
                            onEscKey={setSelectedCell}
                            activities={activities}
                            onActivityClicked={editActivity}
                          />
                        </CellContent>
                        <CellContent
                          key={index + 1}
                          selectedMonth={selectedDate}
                          activityDaySummary={activitiesDaySummary[index + 1]}
                          onClick={addActivity}
                        >
                          <CellHeader
                            selectedMonth={selectedDate}
                            holiday={holiday}
                            vacation={vacation}
                            activities={activities}
                            date={activitiesDaySummary[index + 1].date}
                            time={activitiesDaySummary[index + 1].worked}
                            ref={registerCellRef(index + 1)}
                          />
                          <CellBody
                            isSelected={selectedCell === index + 1}
                            onEscKey={setSelectedCell}
                            activities={[]}
                            onActivityClicked={editActivity}
                          />
                        </CellContent>
                      </>
                    ) : (
                      <CellContent
                        key={index}
                        selectedMonth={selectedDate}
                        activityDaySummary={activityDaySummary}
                        onClick={addActivity}
                      >
                        <CellHeader
                          selectedMonth={selectedDate}
                          holiday={holiday}
                          vacation={vacation}
                          activities={activities}
                          date={activityDaySummary.date}
                          time={activityDaySummary.worked}
                          ref={registerCellRef(index)}
                        />
                        <CellBody
                          isSelected={selectedCell === index}
                          onEscKey={setSelectedCell}
                          activities={activities}
                          onActivityClicked={editActivity}
                        />
                      </CellContent>
                    )}
                  </CalendarCellBlock>
                )
              })}
          </CalendarContainer>
        </SkipNavContent>
      )}

      <ActivityModal
        isOpen={showActivityModal}
        onClose={onCloseActivity}
        onSave={onCloseActivity}
        activityDate={activityDate}
        activity={selectedActivity}
      />
    </>
  )
}

const CalendarContainer = forwardRef<HTMLDivElement, any>((props, ref) => {
  const bg = useColorModeValue('white', 'gray.800')
  const { selectedDate } = useCalendarContext()
  const borderColor = useColorModeValue('gray.300', 'gray.700')
  const weeksInMonthSelected = getWeeksInMonth(selectedDate)
  const maxPercentagePerCalendarRow = 100 / weeksInMonthSelected

  return (
    <Grid
      bg={bg}
      ref={ref}
      h="100%"
      mx="32px"
      role="application"
      templateColumns="repeat(6, minmax(178px, 1fr))"
      templateRows="40px"
      autoRows={`minmax(100px, ${maxPercentagePerCalendarRow}%)`}
      boxShadow="0 3px 15px 0 rgba(0, 0, 0, 0.15)"
      border="solid 1px"
      borderColor={borderColor}
      overflowX="auto"
      overflowY="hidden"
    >
      {props.children}
    </Grid>
  )
})

CalendarContainer.displayName = 'CalendarContainer'
