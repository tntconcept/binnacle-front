import React from "react"
import styles from "pages/binnacle/desktop/ActivityButton/ActivityButton.module.css"
import {IActivity} from "api/interfaces/IActivity"
import {cls} from "utils/helpers"
import {getTimeInterval} from "utils/TimeUtils"
import {ActivityData} from "pages/binnacle/desktop/CalendarGrid/CalendarGrid"

interface ActivityProps {
  activity: IActivity
  onActivitySelect: (activity: ActivityData) => void
  canFocus: boolean
}

const ActivityButton: React.FC<ActivityProps> = ({ activity, onActivitySelect, canFocus }) => {

  const handleActivitySelect = (event: React.MouseEvent) => {
    event.stopPropagation();
    onActivitySelect({
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
