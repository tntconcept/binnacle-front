import React, { useContext } from 'react'
import { addMinutes, isSameMonth } from 'date-fns'
import { cls } from 'utils/helpers'
import styles from 'pages/binnacle/BinnacleDesktopLayout/CalendarCell.module.css'
import CalendarCellHeader from 'pages/binnacle/BinnacleDesktopLayout/CalendarCellHeader'
import CalendarCellBody from 'pages/binnacle/BinnacleDesktopLayout/CalendarCellBody'
import { IActivity, IActivityDay } from 'api/interfaces/IActivity'
import CalendarCellActivityButton from 'pages/binnacle/BinnacleDesktopLayout/CalendarCellActivityButton'
import { CalendarModalContext } from 'pages/binnacle/BinnacleDesktopLayout/CalendarModalContext'
import { useBinnacleResources } from 'core/features/BinnacleResourcesProvider'

interface ICellContent {
  borderBottom?: boolean
  activityDay: IActivityDay
  isSelected: boolean
  setSelectedCell: (a?: any) => any
  registerRef: (instance: HTMLButtonElement | null) => void
}

interface IActivitiesList {
  activities: IActivity[]
  canFocus: boolean
}

const ActivitiesList: React.FC<IActivitiesList> = ({ activities, canFocus }) => {
  return (
    <React.Fragment>
      {activities.map((activity) => (
        <CalendarCellActivityButton
          key={activity.id}
          activity={activity}
          canFocus={canFocus}
        />
      ))}
    </React.Fragment>
  )
}

export const CalendarCellContent: React.FC<ICellContent> = (props) => {
  const { selectedMonth } = useBinnacleResources()
  const updateModalData = useContext(CalendarModalContext)

  // Pensar en subirlo a prop
  const isOtherMonth = !isSameMonth(props.activityDay.date, selectedMonth)

  const createActivity = () => {
    updateModalData({
      date: props.activityDay.date,
      lastEndTime: getLastActivityEndTime(props.activityDay),
      activity: undefined
    })
  }

  return (
    <div
      className={cls(
        styles.container,
        isOtherMonth && styles.isOtherMonth,
        props.borderBottom && styles.containerDivider
      )}
      onClick={createActivity}
    >
      <CalendarCellHeader
        date={props.activityDay.date}
        time={props.activityDay.workedMinutes}
        ref={props.registerRef}
      />
      <CalendarCellBody
        isSelected={props.isSelected}
        onEscKey={props.setSelectedCell}
      >
        <ActivitiesList
          activities={props.activityDay.activities}
          canFocus={props.isSelected}
        />
      </CalendarCellBody>
    </div>
  )
}

const getLastActivityEndTime = (activityDay: IActivityDay) => {
  if (activityDay.activities.length > 0) {
    const lastImputedActivity =
      activityDay.activities[activityDay.activities.length - 1]
    return addMinutes(lastImputedActivity.startDate, lastImputedActivity.duration)
  }

  return undefined
}
