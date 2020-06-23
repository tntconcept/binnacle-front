import React, { useContext } from 'react'
import styles from 'features/CalendarDesktop/ActivityButton/ActivityButton.module.css'
import { IActivity } from 'api/interfaces/IActivity'
import { cls } from 'utils/helpers'
import { getTimeInterval } from 'utils/TimeUtils'
import { CalendarModalContext } from 'features/CalendarDesktop/CalendarModalContext'
import { useSettings } from 'features/SettingsContext/SettingsContext'
import ActivityTooltip from 'features/CalendarDesktop/ActivityButton/ActivityTooltip'
import TooltipTrigger from 'react-popper-tooltip'
import { useTranslation } from 'react-i18next'
import { VisuallyHidden } from 'common/components'

interface ActivityProps {
  activity: IActivity
  canFocus: boolean
}

const ActivityButton: React.FC<ActivityProps> = ({ activity, canFocus }) => {
  const { t } = useTranslation()
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
    <TooltipTrigger
      tooltip={(tooltip) => <ActivityTooltip
        activity={activity}
        {...tooltip} />}
      trigger={['hover', 'focus']}
      delayShow={300}
    >
      {(trigger) => (
        <button
          key={activity.id}
          className={cls(styles.base, activity.billable && styles.billable)}
          onClick={handleActivitySelect}
          tabIndex={canFocus ? 0 : -1}
          {...trigger.getTriggerProps({
            ref: trigger.triggerRef
          })}
          aria-describedby="activity_tooltip"
        >
          <span className={styles.text}>
            <span className={styles.time}>
              {getTimeInterval(activity.startDate, activity.duration)}{' '}
            </span>
            {activity.billable && (
              <VisuallyHidden>
                {', ' + t('activity_form.billable') + ','}
              </VisuallyHidden>
            )}
            {state.showDescription ? (
              activity.description
            ) : (
              <>
                <VisuallyHidden>{t('activity_form.project') + ':'}</VisuallyHidden>
                {activity.project.name}
              </>
            )}
          </span>
        </button>
      )}
    </TooltipTrigger>
  )
}

export default ActivityButton
