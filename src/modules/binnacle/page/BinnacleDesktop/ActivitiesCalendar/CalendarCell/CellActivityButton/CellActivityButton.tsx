import { Icon, Text } from '@chakra-ui/react'
import { OpenUpdateActivityFormAction } from 'modules/binnacle/data-access/actions/open-update-activity-form-action'
import { getTimeInterval } from 'modules/binnacle/data-access/utils/getTimeInterval'
import { ActivityPreview } from 'modules/binnacle/page/BinnacleDesktop/ActivitiesCalendar/CalendarCell/CellActivityButton/ActivityPreview'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { usePopperTooltip } from 'react-popper-tooltip'
import { useAction } from 'shared/arch/hooks/use-action'
import { useGlobalState } from 'shared/arch/hooks/use-global-state'
import { SettingsState } from 'shared/data-access/state/settings-state'
import { observer } from 'mobx-react'
import 'react-popper-tooltip/dist/styles.css'
import { TimeUnits } from 'shared/types/time-unit'
import { ActivityWithRenderDays } from '../../types/activity-with-render-days'
import { ActivityItem } from './ActivityItem'
import { ActivityApprovalStates } from 'modules/binnacle/data-access/interfaces/activity-approval-state.interface'
import { CheckCircleIcon, QuestionMarkCircleIcon } from '@heroicons/react/solid'

interface ActivityProps {
  activity: ActivityWithRenderDays
  canFocus: boolean
}

export const CellActivityButton: FC<ActivityProps> = observer(({ activity, canFocus }) => {
  const { t } = useTranslation()
  const { settings } = useGlobalState(SettingsState)

  const openUpdateActivityForm = useAction(OpenUpdateActivityFormAction)
  const handleOpenUpdateActivityForm = async (event: MouseEvent) => {
    // stop event propagation to prevent the cell click handler to execute
    event.stopPropagation()
    await openUpdateActivityForm(activity)
  }
  const activityIsInMinutes = activity.interval.timeUnit === TimeUnits.MINUTES
  const activityIsApproved = activity.approvalState === ActivityApprovalStates.ACCEPTED
  const activityIsPendingApproval = activity.approvalState === ActivityApprovalStates.PENDING

  const timeDescription = activityIsInMinutes
    ? getTimeInterval(activity.interval.start, activity.interval.duration)
    : ''

  const getA11yLabel = () => {
    const billableDescription = activity.billable ? t('activity_form.billable') : ''
    const description = settings.showDescription
      ? activity.description
      : `${t('activity_form.project')}:${activity.project.name}`

    return [timeDescription, billableDescription, description]
      .filter((text) => text !== '')
      .join(', ')
  }

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
          {activityIsApproved && <Icon as={CheckCircleIcon} fontSize="md" color="white" />}
          {activityIsPendingApproval && (
            <Icon as={QuestionMarkCircleIcon} fontSize="md" color="black" />
          )}
          <b>{timeDescription}</b>{' '}
          {settings.showDescription ? activity.description : activity.project.name}
        </Text>
      </ActivityItem>
      {visible && (
        <ActivityPreview
          activity={activity}
          setTooltipRef={setTooltipRef}
          getTooltipProps={getTooltipProps}
          getArrowProps={getArrowProps}
        />
      )}
    </>
  )
})
