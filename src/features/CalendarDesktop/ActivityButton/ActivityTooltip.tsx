import React from 'react'
import 'react-popper-tooltip/dist/styles.css'
import { TooltipArg } from 'react-popper-tooltip'
import { IActivity } from 'api/interfaces/IActivity'
import { ReactComponent as UsersGroupIcon } from 'assets/icons/users-group.svg'
import { ReactComponent as UsersIcon } from 'assets/icons/users.svg'
import { ReactComponent as UserIcon } from 'assets/icons/user.svg'
import { ReactComponent as ClockIcon } from 'assets/icons/clock.svg'
import { ReactComponent as CurrencyEuroIcon } from 'assets/icons/currency-euro.svg'
import { ReactComponent as PhotoIcon } from 'assets/icons/photo.svg'
import { getDuration } from 'utils/TimeUtils'
import { useSettings } from 'features/SettingsContext/SettingsContext'
import styles from './ActivityTooltip.module.css'
import { useTranslation } from 'react-i18next'
import { VisuallyHidden } from 'common/components'
import DateTime from 'services/DateTime'

interface Props extends TooltipArg {
  activity: IActivity
}

const ActivityTooltip = (props: Props) => {
  const { t } = useTranslation()
  const { state } = useSettings()

  const a11yLabel = `
    ${t('activity_form.organization')}: ${props.activity.organization.name},
    ${t('activity_form.project')}: ${props.activity.project.name},
    ${t('activity_form.role')}: ${props.activity.projectRole.name},
    ${t('activity_form.duration')}: ${DateTime.getHumanizedDuration(
  props.activity.duration,
  false
)},
    ${props.activity.billable ? t('activity_form.billable') + ',' : ''}
    ${props.activity.hasImage ? t('activity_form.image') + ',' : ''}
  `

  return (
    <div
      {...props.getTooltipProps({
        ref: props.tooltipRef,
        className: 'tooltip-container'
      })}
      role="tooltip"
      id="activity_tooltip"
    >
      <div
        {...props.getArrowProps({
          ref: props.arrowRef,
          className: 'tooltip-arrow',
          'data-placement': props.placement
        })}
      />
      <div className={styles.base}>
        <div aria-label={a11yLabel}>
          <div>
            <span className={styles.text}>
              <UsersGroupIcon />
              {props.activity.organization.name}
            </span>
            <span className={styles.text}>
              <UsersIcon />
              {props.activity.project.name}
            </span>
            <span className={styles.text}>
              <UserIcon />
              {props.activity.projectRole.name}
            </span>
          </div>
          <div>
            <span className={styles.text}>
              <ClockIcon />
              <span
                aria-label={DateTime.getHumanizedDuration(
                  props.activity.duration,
                  false
                )}
              >
                {getDuration(props.activity.duration, state.useDecimalTimeFormat)}
              </span>
            </span>
            {props.activity.billable && (
              <span className={styles.text}>
                <CurrencyEuroIcon />
                {t('activity_form.billable')}
              </span>
            )}
            {props.activity.hasImage && (
              <span className={styles.text}>
                <PhotoIcon />
                {t('activity_form.image')}
              </span>
            )}
          </div>
        </div>
        <p className={styles.description}>
          <VisuallyHidden>{t('activity_form.description') + ':'}</VisuallyHidden>
          {props.activity.description}
        </p>
      </div>
    </div>
  )
}
export default ActivityTooltip
