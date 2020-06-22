import React, { useContext } from 'react'
import styles from 'features/CalendarDesktop/ActivityButton/ActivityButton.module.css'
import { IActivity } from 'api/interfaces/IActivity'
import { cls } from 'utils/helpers'
import { getTimeInterval } from 'utils/TimeUtils'
import { CalendarModalContext } from 'features/CalendarDesktop/CalendarModalContext'
import { useSettings } from 'features/SettingsContext/SettingsContext'

interface ActivityProps {
  activity: IActivity
  canFocus: boolean
}

const ActivityButton: React.FC<ActivityProps> = ({ activity, canFocus }) => {
  const updateModalData = useContext(CalendarModalContext)
  const { state } = useSettings()

  const handleActivitySelect = (event: React.MouseEvent) => {
    event.stopPropagation()
    updateModalData({
      activity: activity,
      date: activity.startDate,
      lastEndTime: undefined
    })
  }

  return (
    <button
      key={activity.id}
      className={cls(styles.base, activity.billable && styles.billable)}
      onClick={handleActivitySelect}
      tabIndex={canFocus ? 0 : -1}
    >
      <span className={styles.text}>
        <span className={styles.time}>
          {getTimeInterval(activity.startDate, activity.duration)}
        </span>{' '}
        {state.showDescription ? activity.description : activity.project.name}
      </span>
    </button>
  )
}

export default ActivityButton
