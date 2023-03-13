import { Grid, useColorModeValue } from '@chakra-ui/react'
import { observer } from 'mobx-react'
import { BinnacleState } from 'modules/binnacle/data-access/state/binnacle-state'
import { CalendarCellBlock } from 'modules/binnacle/page/BinnacleDesktop/ActivitiesCalendar/CalendarCell/CalendarCellBlock'
import { CellContent } from 'modules/binnacle/page/BinnacleDesktop/ActivitiesCalendar/CalendarCell/CellContent/CellContent'
import CalendarHeader from 'modules/binnacle/page/BinnacleDesktop/ActivitiesCalendar/CalendarHeader'
import { useCalendarKeysNavigation } from 'modules/binnacle/page/BinnacleDesktop/ActivitiesCalendar/useCalendarKeyboardNavigation'
import { forwardRef, Fragment, useState } from 'react'
import { useGlobalState } from 'shared/arch/hooks/use-global-state'
import { getWeeksInMonth, isSaturday, isSunday } from 'shared/utils/chrono'
import { CellHeader } from './CalendarCell/CellHeader/CellHeader'
import { CellBody } from 'modules/binnacle/page/BinnacleDesktop/ActivitiesCalendar/CalendarCell/CellBody/CellBody'
import { ActivityDaySummary } from 'modules/binnacle/data-access/interfaces/activity-day-summary'
import { ActivitiesPerDay } from 'modules/binnacle/data-access/interfaces/activities-per-day.interface'

export const ActivitiesCalendar = observer(() => {
  const { holidays, selectedDate, activitiesDaySummary } = useGlobalState(BinnacleState)

  const [selectedCell, setSelectedCell] = useState<number | null>(null)
  const { calendarRef, registerCellRef } = useCalendarKeysNavigation(selectedDate, setSelectedCell)

  return (
    <CalendarContainer ref={calendarRef}>
      <CalendarHeader />
      {activitiesDaySummary.map((activityDaySummary: ActivityDaySummary, index: number) => {
        // TODO: Pending take activities
        const activityPerDay = { activities: [] } as unknown as ActivitiesPerDay

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
              <Fragment>
                <CellContent
                  key={index}
                  selectedMonth={selectedDate}
                  borderBottom={true}
                  activityDay={activityDaySummary}
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
                    activityDay={activityPerDay}
                  />
                </CellContent>
                <CellContent
                  key={index + 1}
                  selectedMonth={selectedDate}
                  activityDay={activitiesDaySummary[index + 1]}
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
                    activityDay={activityPerDay}
                  />
                </CellContent>
              </Fragment>
            ) : (
              <CellContent
                key={index}
                selectedMonth={selectedDate}
                activityDay={activityDaySummary}
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
                  activityDay={activityPerDay}
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
