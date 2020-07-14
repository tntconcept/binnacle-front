import React, { useState } from 'react'
import styles from 'features/CalendarDesktop/CalendarGrid/CalendarGrid.module.css'
import { isSaturday, isSunday } from 'date-fns'
import Cell from 'features/CalendarDesktop/CalendarCell'
import { CellContent } from 'features/CalendarDesktop/CalendarCell/CellContent'
import CalendarGridHeader from 'features/CalendarDesktop/CalendarGrid/CalendarGridHeader'
import useCalendarKeysNavigation from 'features/CalendarDesktop/CalendarGrid/useCalendarKeyboardNavigation'
import { useBinnacleResources } from 'features/BinnacleResourcesProvider'

const CalendarGrid: React.FC = () => {
  const { selectedMonth, activitiesReader } = useBinnacleResources()
  const activities = activitiesReader().activities
  const [selectedCell, setSelectedCell] = useState<number | null>(null)
  const { calendarRef, cellsRef } = useCalendarKeysNavigation(
    selectedMonth,
    setSelectedCell
  )

  const renderCells = () => {
    return activities.map((activity: any, index: any) => {
      if (isSunday(activity.date)) {
        return null
      }

      return (
        <Cell key={activity.date.getTime() + index}>
          {isSaturday(activity.date) ? (
            <React.Fragment>
              <CellContent
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
              <CellContent
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
            <CellContent
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
    })
  }

  return (
    <div
      role="application"
      className={styles.container}
      ref={calendarRef}>
      <CalendarGridHeader />
      {renderCells()}
    </div>
  )
}

export default CalendarGrid
