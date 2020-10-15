import React from 'react'
import 'react-popper-tooltip/dist/styles.css'
import { TooltipArg } from 'react-popper-tooltip'
import { IActivity } from 'api/interfaces/IActivity'
import { ReactComponent as UsersIcon } from 'assets/icons/users.svg'
import { ReactComponent as UserIcon } from 'assets/icons/user.svg'
import { ReactComponent as ClockIcon } from 'assets/icons/clock.svg'
import { ReactComponent as CurrencyEuroIcon } from 'assets/icons/currency-euro.svg'
import { ReactComponent as PhotoIcon } from 'assets/icons/photo.svg'
import { getDuration } from 'utils/TimeUtils'
import { useTranslation } from 'react-i18next'
import DateTime from 'services/DateTime'
import { useSettings } from 'core/components/SettingsContext'
import { ReactComponent as OfficeIcon } from 'assets/icons/office-building.svg'
import { VisuallyHidden, Box, Text, Icon } from '@chakra-ui/core'

interface Props extends TooltipArg {
  activity: IActivity
}

const CalendarCellActivityButtonTooltip = (props: Props) => {
  const { t } = useTranslation()
  const [settings] = useSettings()

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
      data-testid="activity_tooltip"
    >
      <div
        {...props.getArrowProps({
          ref: props.arrowRef,
          className: 'tooltip-arrow',
          'data-placement': props.placement
        })}
      />
      <Box maxWidth="600px">
        <div aria-label={a11yLabel}>
          <div>
            <Text as="span" display="inline-flex" alignItems="center" fontSize="sm" mr={2}>
              <Icon as={OfficeIcon} mr={1} color="gray.400" />
              {props.activity.organization.name}
            </Text>
            <Text as="span" display="inline-flex" alignItems="center" fontSize="sm" mr={2}>
              <Icon as={UsersIcon} mr={1} color="gray.400" />
              {props.activity.project.name}
            </Text>
            <Text as="span" display="inline-flex" alignItems="center" fontSize="sm" mr={2}>
              <Icon as={UserIcon} mr={1} color="gray.400" />
              {props.activity.projectRole.name}
            </Text>
          </div>
          <div>
            <Text as="span" display="inline-flex" alignItems="center" fontSize="sm" mr={2}>
              <Icon as={ClockIcon} mr={1} color="gray.400" />
              <span aria-label={DateTime.getHumanizedDuration(props.activity.duration, false)}>
                {getDuration(props.activity.duration, settings.useDecimalTimeFormat)}
              </span>
            </Text>
            {props.activity.billable && (
              <Text as="span" display="inline-flex" alignItems="center" fontSize="sm" mr={2}>
                <Icon as={CurrencyEuroIcon} mr={1} color="gray.400" />
                {t('activity_form.billable')}
              </Text>
            )}
            {props.activity.hasImage && (
              <Text as="span" display="inline-flex" alignItems="center" fontSize="sm" mr={2}>
                <Icon as={PhotoIcon} mr={1} color="gray.400" />
                {t('activity_form.image')}
              </Text>
            )}
          </div>
        </div>
        <Text isTrunctated noOfLines={3}>
          <VisuallyHidden>{t('activity_form.description') + ':'}</VisuallyHidden>
          {props.activity.description}
        </Text>
      </Box>
    </div>
  )
}

export default CalendarCellActivityButtonTooltip
