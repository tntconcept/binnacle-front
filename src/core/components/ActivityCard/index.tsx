import React, {useContext} from "react"
import {ReactComponent as Clock} from "assets/icons/clock.svg"
import {ReactComponent as Users} from "assets/icons/users.svg"
import {IActivity} from "api/interfaces/IActivity"
import {cls} from "utils/helpers"
import styles from "./ActivityCard.module.css"
import {useTranslation} from "react-i18next"
import {SettingsContext} from "core/contexts/SettingsContext/SettingsContext"
import {getDuration, getTimeInterval} from "utils/TimeUtils"

interface IProps {
  activity: IActivity;
}

const ActivityCard: React.FC<IProps> = ({ activity }) => {
  const { t } = useTranslation()
  const {state} = useContext(SettingsContext)

  const getTime = () => {
    const timeInterval = getTimeInterval(activity.startDate, activity.duration)
    const duration = getDuration(activity.duration, state.useDecimalTimeFormat)
    return `${timeInterval} (${duration})`
  }

  return (
    <div
      className={cls(styles.base, activity.billable && styles.isBillable)}
      data-testid="activity_card"
    >
      {activity.billable && <span className={styles.billable}>{t("activity_form.billable")}</span>}
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
          <span>{getTime()}</span>
        </div>
      </div>
      <div className={styles.line} />
      <p className={styles.description}>{activity.description}</p>
    </div>
  );
};

export default ActivityCard;
