import React from 'react'
import { TooltipArg } from 'react-popper-tooltip'
import 'react-popper-tooltip/dist/styles.css'
import { IActivity } from 'core/api/interfaces'
import { ReactComponent as UsersIcon } from 'heroicons/outline/users.svg'
import { ReactComponent as UserIcon } from 'heroicons/outline/user.svg'
import { ReactComponent as ClockIcon } from 'heroicons/outline/clock.svg'
import { ReactComponent as CurrencyEuroIcon } from 'heroicons/outline/currency-euro.svg'
import { ReactComponent as PhotoIcon } from 'heroicons/outline/photograph.svg'
import { ReactComponent as OfficeIcon } from 'heroicons/outline/office-building.svg'
import { useTranslation } from 'react-i18next'
import { VisuallyHidden, Box, Text, Icon, useColorModeValue } from '@chakra-ui/core'
import { useSettings } from 'pages/settings/Settings.utils'
import { getHumanizedDuration } from 'core/services/Chrono'
import { getDuration } from 'pages/binnacle/BinnaclePage.utils'

interface Props extends TooltipArg {
  activity: IActivity
}

const CalendarCellActivityButtonTooltip = (props: Props) => {
  const { t } = useTranslation()
  const settings = useSettings()

  const a11yLabel = `
    ${t('activity_form.organization')}: ${props.activity.organization.name},
    ${t('activity_form.project')}: ${props.activity.project.name},
    ${t('activity_form.role')}: ${props.activity.projectRole.name},
    ${t('activity_form.duration')}: ${getHumanizedDuration(props.activity.duration, false)},
    ${props.activity.billable ? t('activity_form.billable') + ',' : ''}
    ${props.activity.hasImage ? t('activity_form.image') + ',' : ''}
  `
  const bg = useColorModeValue('white', 'gray.800')

  return (
    <Box
      {...props.getTooltipProps({
        ref: props.tooltipRef,
        className: 'tooltip-container'
      })}
      role="tooltip"
      id="activity_tooltip"
      data-testid="activity_tooltip"
      bgColor={bg}
    >
      <Box
        {...props.getArrowProps({
          ref: props.arrowRef,
          className: 'tooltip-arrow',
          'data-placement': props.placement
        })}
        _after={{
          borderColor: bg
        }}
      />
      <Box maxWidth="600px" bg={bg}>
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
              <span aria-label={getHumanizedDuration(props.activity.duration, false)}>
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
        <Text isTruncated noOfLines={3}>
          <VisuallyHidden>{t('activity_form.description') + ':'}</VisuallyHidden>
          {props.activity.description}
        </Text>
      </Box>
    </Box>
  )
}

export default CalendarCellActivityButtonTooltip
