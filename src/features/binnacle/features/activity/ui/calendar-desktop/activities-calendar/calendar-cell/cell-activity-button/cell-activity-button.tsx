import { Text } from '@chakra-ui/react'
import { getTimeInterval } from '../../../../../utils/get-time-interval'
import { GetUserSettingsQry } from '../../../../../../../../shared/user/features/settings/application/get-user-settings-qry'
import { FC, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { usePopperTooltip } from 'react-popper-tooltip'
import 'react-popper-tooltip/dist/styles.css'
import { useExecuteUseCaseOnMount } from '../../../../../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { TimeUnits } from '../../../../../../../../../shared/types/time-unit'
import { ActivityWithRenderDays } from '../../../../../domain/activity-with-render-days'
import { useCalendarContext } from '../../../../contexts/calendar-context'
import { ActivityItem } from './activity-item'
import { ActivityPreview } from './activity-preview'

interface ActivityProps {
  activity: ActivityWithRenderDays
  canFocus: boolean
  onClick: (activity: ActivityWithRenderDays) => void
}

export const CellActivityButton: FC<ActivityProps> = ({ activity, canFocus, onClick }) => {
  const { t } = useTranslation()
  const { result: settings } = useExecuteUseCaseOnMount(GetUserSettingsQry)
  const { shouldUseDecimalTimeFormat } = useCalendarContext()

  const handleOpenUpdateActivityForm = async (event: MouseEvent) => {
    // stop event propagation to prevent the cell click handler to execute
    event.stopPropagation()
    onClick(activity)
  }
  const activityIsInMinutes = activity.interval.timeUnit === TimeUnits.MINUTES

  const timeDescription = activityIsInMinutes
    ? getTimeInterval(activity.interval.start, activity.interval.duration)
    : ''

  const getA11yLabel = useCallback(() => {
    const billableDescription = activity.billable ? t('activity_form.billable') : ''
    const description = settings?.showDescription
      ? activity.description
      : `${t('activity_form.project')}:${activity.project.name}`

    return [timeDescription, billableDescription, description]
      .filter((text) => text !== '')
      .join(', ')
  }, [
    activity.billable,
    activity.description,
    activity.project.name,
    settings?.showDescription,
    t,
    timeDescription
  ])

  const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({
      trigger: canFocus ? ['focus', 'hover'] : 'hover',
      delayShow: canFocus ? 0 : 300
    })

  return (
    <>
      <ActivityItem
        key={activity.id}
        activity={activity}
        onClick={handleOpenUpdateActivityForm}
        tabIndex={canFocus ? 0 : -1}
        aria-describedby="activity_tooltip"
        ref={setTriggerRef}
      >
        <Text
          as="span"
          display="inline-flex"
          alignItems="center"
          gap={0.5}
          isTruncated
          aria-label={getA11yLabel()}
        >
          <b>{timeDescription}</b>{' '}
          {settings?.showDescription ? activity.description : activity.project.name}
        </Text>
      </ActivityItem>
      {visible && (
        <ActivityPreview
          activity={activity}
          setTooltipRef={setTooltipRef}
          getTooltipProps={getTooltipProps}
          getArrowProps={getArrowProps}
          useDecimalTimeFormat={shouldUseDecimalTimeFormat}
        />
      )}
    </>
  )
}
