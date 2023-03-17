import { Grid, useColorModeValue } from '@chakra-ui/react'
import { observer } from 'mobx-react'
import { BinnacleState } from 'modules/binnacle/data-access/state/binnacle-state'
import { CalendarCellBlock } from 'modules/binnacle/page/BinnacleDesktop/ActivitiesCalendar/CalendarCell/CalendarCellBlock'
import { CellContent } from 'modules/binnacle/page/BinnacleDesktop/ActivitiesCalendar/CalendarCell/CellContent/CellContent'
import CalendarHeader from 'modules/binnacle/page/BinnacleDesktop/ActivitiesCalendar/CalendarHeader'
import { useCalendarKeysNavigation } from 'modules/binnacle/page/BinnacleDesktop/ActivitiesCalendar/useCalendarKeyboardNavigation'
import { forwardRef, useMemo, useState } from 'react'
import { useGlobalState } from 'shared/arch/hooks/use-global-state'
import chrono, { getWeeksInMonth, isSaturday, isSunday } from 'shared/utils/chrono'
import { CellHeader } from './CalendarCell/CellHeader/CellHeader'
import { CellBody } from 'modules/binnacle/page/BinnacleDesktop/ActivitiesCalendar/CalendarCell/CellBody/CellBody'
import { ActivityDaySummary } from 'modules/binnacle/data-access/interfaces/activity-day-summary'
import { TimeUnits } from 'shared/types/time-unit'
import { ActivityWithRenderDays } from './types/activity-with-render-days'

export const ActivitiesCalendar = observer(() => {
  const { activities, holidays, selectedDate, activitiesDaySummary } = useGlobalState(BinnacleState)

  const [selectedCell, setSelectedCell] = useState<number | null>(null)
  const { calendarRef, registerCellRef } = useCalendarKeysNavigation(selectedDate, setSelectedCell)

  const activitiesInDays = useMemo(() => {
    if (!activities) return []

    return activities.filter((a) => a.interval.timeUnit === TimeUnits.DAY)
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

  return (
    <CalendarContainer ref={calendarRef}>
      <CalendarHeader />
      {activitiesDaySummary.map((activityDaySummary: ActivityDaySummary, index: number) => {
        const activities = getActivitiesByDate(activityDaySummary.date)

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
                >
                  <CellHeader
                    selectedMonth={selectedDate}
                    holidays={holidays}
                    date={activityDaySummary.date}
                    time={activityDaySummary.worked}
                    ref={registerCellRef(index)}
                  />
                  <CellBody
                    isSelected={selectedCell === index}
                    onEscKey={setSelectedCell}
                    activities={activities}
                  />
                </CellContent>
                <CellContent
                  key={index + 1}
                  selectedMonth={selectedDate}
                  activityDaySummary={activitiesDaySummary[index + 1]}
                >
                  <CellHeader
                    selectedMonth={selectedDate}
                    holidays={holidays}
                    date={activitiesDaySummary[index + 1].date}
                    time={activitiesDaySummary[index + 1].worked}
                    ref={registerCellRef(index + 1)}
                  />
                  <CellBody
                    isSelected={selectedCell === index + 1}
                    onEscKey={setSelectedCell}
                    activities={[]}
                  />
                </CellContent>
              </>
            ) : (
              <CellContent
                key={index}
                selectedMonth={selectedDate}
                activityDaySummary={activityDaySummary}
              >
                <CellHeader
                  selectedMonth={selectedDate}
                  holidays={holidays}
                  date={activityDaySummary.date}
                  time={activityDaySummary.worked}
                  ref={registerCellRef(index)}
                />
                <CellBody
                  isSelected={selectedCell === index}
                  onEscKey={setSelectedCell}
                  activities={activities}
                />
              </CellContent>
            )}
          </CalendarCellBlock>
        )
      })}
    </CalendarContainer>
  )
})

const CalendarContainer = forwardRef<HTMLDivElement, any>((props, ref) => {
  const bg = useColorModeValue('white', 'gray.800')
  const { selectedDate } = useGlobalState(BinnacleState)
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
