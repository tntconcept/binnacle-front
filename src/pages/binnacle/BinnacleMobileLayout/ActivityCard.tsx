import React from 'react'
import { ReactComponent as ClockIcon } from 'assets/icons/clock.svg'
import { ReactComponent as UsersIcon } from 'assets/icons/users.svg'
import { IActivity } from 'api/interfaces/IActivity'
import { cls } from 'utils/helpers'
import styles from 'pages/binnacle/BinnacleMobileLayout/ActivityCard.module.css'
import { useTranslation } from 'react-i18next'
import { getDuration, getTimeInterval } from 'utils/TimeUtils'
import { useSettings } from 'core/components/SettingsContext'

interface IProps {
  activity: IActivity
}

const ActivityCard: React.FC<IProps> = ({ activity }) => {
  const { t } = useTranslation()
  const [settings] = useSettings()

  const getTime = () => {
    const timeInterval = getTimeInterval(activity.startDate, activity.duration)
    const duration = getDuration(activity.duration, settings.useDecimalTimeFormat)
    return `${timeInterval} (${duration})`
  }

  return (
    <div
      className={cls(styles.base, activity.billable && styles.isBillable)}
      data-testid="activity_card"
    >
      {activity.billable && (
        <span className={styles.billable}>{t('activity_form.billable')}</span>
      )}
      <div>
        <span className={styles.organization}>{activity.organization.name}</span>
        <div className={styles.headerBlockWithMarginBottom}>
          <p className={styles.projectAndRoleText}>
            <UsersIcon className={styles.icon} />
            {activity.project.name}
          </p>
          <span className={styles.dot}>.</span>
          <p className={styles.projectAndRoleText}>{activity.projectRole.name}</p>
        </div>
        <div className={styles.headerBlock}>
          <p>
            <ClockIcon
              className={styles.icon}
              style={{
                marginRight: 0
              }}
            />{' '}
            {getTime()}
          </p>
        </div>
      </div>
      <div className={styles.line} />
      <p className={styles.description}>{activity.description}</p>
    </div>
  )
}

export default ActivityCard
