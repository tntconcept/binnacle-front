import React from "react"
import {ReactComponent as Clock} from "assets/icons/clock.svg"
import {ReactComponent as Users} from "assets/icons/users.svg"
import {IActivity} from "interfaces/IActivity"
import {cls} from "utils/helpers"
import styles from "./ActivityCard.module.css"

interface IProps {
  activity: IActivity;
}

const ActivityCard: React.FC<IProps> = ({ activity }) => {
  return (
    <div className={cls(styles.base, activity.billable && styles.isBillable)}>
      {activity.billable && <span className={styles.billable}>facturable</span>}
      <div>
        <span className={styles.organization}>
          {activity.organization.name}
        </span>
        <div className={styles.headerBlockWithMarginBottom}>
          <Users className={styles.icon} />
          <p className={styles.projectAndRoleText}>{activity.project.name}</p>
          <span className={styles.dot}>.</span>
          <p className={styles.projectAndRoleText}>
            {activity.projectRole.name}
          </p>
        </div>
        <div className={styles.headerBlock}>
          <Clock className={styles.icon} />
          <span>10:30 - 12:30 (2h 30m)</span>
        </div>
      </div>
      <div className={styles.line} />
      <p className={styles.description}>{activity.description}</p>
    </div>
  );
};

export default ActivityCard;
