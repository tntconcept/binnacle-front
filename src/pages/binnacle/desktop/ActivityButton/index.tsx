import React, {useContext} from "react"
import styles from "pages/binnacle/desktop/ActivityButton/ActivityButton.module.css"
import {IActivity} from "api/interfaces/IActivity"
import {cls} from "utils/helpers"
import {getTimeInterval} from "utils/TimeUtils"
import {CalendarModalContext} from "pages/binnacle/desktop/CalendarModalContext"

interface ActivityProps {
  activity: IActivity
  canFocus: boolean
}

const ActivityButton: React.FC<ActivityProps> = ({ activity, canFocus }) => {
  const updateModalData = useContext(CalendarModalContext)

  const handleActivitySelect = (event: React.MouseEvent) => {
    event.stopPropagation();
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
        <span className={styles.time}>{getTimeInterval(activity.startDate, activity.duration)}</span>{" "}
        {activity.project.name}
      </span>
    </button>
  );
};

export default ActivityButton;
