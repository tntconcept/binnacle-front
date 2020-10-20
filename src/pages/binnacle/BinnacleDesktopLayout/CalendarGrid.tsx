import React, { forwardRef, useState } from 'react'
import Cell from 'pages/binnacle/BinnacleDesktopLayout/CalendarCell'
import { CalendarCellContent } from 'pages/binnacle/BinnacleDesktopLayout/CalendarCellContent'
import CalendarHeader from 'pages/binnacle/BinnacleDesktopLayout/CalendarHeader'
import useCalendarKeysNavigation from 'pages/binnacle/BinnacleDesktopLayout/useCalendarKeyboardNavigation'
import { useBinnacleResources } from 'core/features/BinnacleResourcesProvider'
import { Grid, useColorModeValue } from '@chakra-ui/core'
import { isSunday, isSaturday } from 'services/Chrono'

const CalendarGrid: React.FC = () => {
  const { selectedMonth, activitiesReader } = useBinnacleResources()
  const activities = activitiesReader().activities
  const [selectedCell, setSelectedCell] = useState<number | null>(null)
  const { calendarRef, cellsRef } = useCalendarKeysNavigation(selectedMonth, setSelectedCell)

  return (
    // @ts-ignore
    <CalendarContainer ref={calendarRef}>
      <CalendarHeader />
      {activities.map((activity: any, index: any) => {
        if (isSunday(activity.date)) {
          return null
        }

        const isSaturda = isSaturday(activity.date)

        return (
          <Cell key={activity.date.getTime() + index} noBorderRight={isSaturda}>
            {isSaturda ? (
              <React.Fragment>
                <CalendarCellContent
                  key={index}
                  borderBottom={true}
                  activityDay={activity}
                  isSelected={selectedCell === index}
                  setSelectedCell={setSelectedCell}
                  registerRef={(ref: any) => {
                    // @ts-ignore
                    cellsRef.current[index] = ref
                  }}
                />
                <CalendarCellContent
                  key={index + 1}
                  activityDay={activities[index + 1]}
                  isSelected={selectedCell === index + 1}
                  setSelectedCell={setSelectedCell}
                  registerRef={(ref: any) => {
                    // @ts-ignore
                    cellsRef.current[index + 1] = ref
                  }}
                />
              </React.Fragment>
            ) : (
              <CalendarCellContent
                key={index}
                activityDay={activity}
                isSelected={selectedCell === index}
                setSelectedCell={setSelectedCell}
                registerRef={(ref: any) => {
                  // @ts-ignore
                  cellsRef.current[index] = ref
                }}
              />
            )}
          </Cell>
        )
      })}
    </CalendarContainer>
  )
}

const CalendarContainer = forwardRef<HTMLDivElement, {}>((props, ref) => {
  const bg = useColorModeValue('white', 'gray.800')

  return (
    <Grid
      templateColumns="repeat(6, minmax(178px, 1fr))"
      templateRows="50px"
      autoRows="1fr"
      overflow="auto"
      boxShadow="0 3px 15px 0 rgba(0, 0, 0, 0.15)"
      border="solid 1px"
      borderColor="gray.300"
      bg={bg}
      mx="32px"
      mb="32px"
      h="100%"
      role="application"
      ref={ref}
    >
      {props.children}
    </Grid>
  )
})

export default CalendarGrid
