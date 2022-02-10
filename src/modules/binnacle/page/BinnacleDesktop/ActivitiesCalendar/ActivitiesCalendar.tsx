import { Grid, useColorModeValue } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { BinnacleState } from "modules/binnacle/data-access/state/binnacle-state";
import { CalendarCellBlock } from "modules/binnacle/page/BinnacleDesktop/ActivitiesCalendar/CalendarCell/CalendarCellBlock";
import { CellContent } from "modules/binnacle/page/BinnacleDesktop/ActivitiesCalendar/CalendarCell/CellContent/CellContent";
import CalendarHeader from "modules/binnacle/page/BinnacleDesktop/ActivitiesCalendar/CalendarHeader";
import { useCalendarKeysNavigation } from "modules/binnacle/page/BinnacleDesktop/ActivitiesCalendar/useCalendarKeyboardNavigation";
import { forwardRef, Fragment, useState } from "react";
import { useGlobalState } from "shared/arch/hooks/use-global-state";
import { isSaturday, isSunday } from "shared/utils/chrono";
import { CellHeader } from "./CalendarCell/CellHeader/CellHeader";
import { CellBody } from "modules/binnacle/page/BinnacleDesktop/ActivitiesCalendar/CalendarCell/CellBody/CellBody";
import type { ActivitiesPerDay } from "modules/binnacle/data-access/interfaces/activities-per-day.interface";

export const ActivitiesCalendar = observer(() => {
  const { activities, holidays, selectedDate } = useGlobalState(BinnacleState);

  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const { calendarRef, registerCellRef } = useCalendarKeysNavigation(selectedDate, setSelectedCell);

  return (
    <CalendarContainer ref={calendarRef}>
      <CalendarHeader />
      {activities.map((activity: ActivitiesPerDay, index: number) => {
        if (isSunday(activity.date)) {
          return null
        }

        const shouldRenderWeekendCells = isSaturday(activity.date)

        return (
          <CalendarCellBlock
            key={activity.date.getTime() + index}
            noBorderRight={shouldRenderWeekendCells}
          >
            {shouldRenderWeekendCells ? (
              // Weekend cells
              <Fragment>
                <CellContent
                  key={index}
                  selectedMonth={selectedDate}
                  borderBottom={true}
                  activityDay={activity}
                >
                  <CellHeader
                    selectedMonth={selectedDate}
                    holidays={holidays}
                    date={activity.date}
                    time={activity.workedMinutes}
                    ref={registerCellRef(index)}
                  />
                  <CellBody
                    isSelected={selectedCell === index}
                    onEscKey={setSelectedCell}
                    activityDay={activity}
                  />
                </CellContent>
                <CellContent
                  key={index + 1}
                  selectedMonth={selectedDate}
                  activityDay={activities[index + 1]}
                >
                  <CellHeader
                    selectedMonth={selectedDate}
                    holidays={holidays}
                    date={activities[index + 1].date}
                    time={activities[index + 1].workedMinutes}
                    ref={registerCellRef(index + 1)}
                  />
                  <CellBody
                    isSelected={selectedCell === index + 1}
                    onEscKey={setSelectedCell}
                    activityDay={activities[index + 1]}
                  />
                </CellContent>
              </Fragment>
            ) : (
              <CellContent key={index} selectedMonth={selectedDate} activityDay={activity}>
                <CellHeader
                  selectedMonth={selectedDate}
                  holidays={holidays}
                  date={activity.date}
                  time={activity.workedMinutes}
                  ref={registerCellRef(index)}
                />
                <CellBody
                  isSelected={selectedCell === index}
                  onEscKey={setSelectedCell}
                  activityDay={activity}
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
  const borderColor = useColorModeValue('gray.300', 'gray.700')

  return (
    <Grid
      bg={bg}
      ref={ref}
      h="100%"
      mx="32px"
      mb="32px"
      role="application"
      templateColumns="repeat(6, minmax(178px, 1fr))"
      templateRows="50px"
      height="100vh"
      autoRows="1fr"
      boxShadow="0 3px 15px 0 rgba(0, 0, 0, 0.15)"
      border="solid 1px"
      borderColor={borderColor}
    >
      {props.children}
    </Grid>
  )
})

CalendarContainer.displayName = 'CalendarContainer'
