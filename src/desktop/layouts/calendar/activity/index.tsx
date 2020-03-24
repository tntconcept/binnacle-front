import React from "react"
import {getTimeInterval} from "desktop/layouts/calendar/utils"
import styles from "./activity.module.css"
import {IActivity} from "api/interfaces/IActivity"
import {cls} from "utils/helpers"

interface ActivityProps {
  activity: IActivity
  onActivitySelect: (activity: IActivity) => void
}

const ActivityButton: React.FC<ActivityProps> = ({ activity, onActivitySelect }) => {

  const handleActivitySelect = (event: React.MouseEvent) => {
    event.stopPropagation();
    onActivitySelect(activity)
  }

  return (
    <button
      key={activity.id}
      className={cls(styles.base, activity.billable && styles.billable)}
      onClick={handleActivitySelect}
    >
      <span className={styles.text}>
        <span className={styles.time}>{getTimeInterval(activity.startDate, activity.duration)}</span>{" "}
        {activity.project.name}
      </span>
    </button>
  );
};

export default ActivityButton;
