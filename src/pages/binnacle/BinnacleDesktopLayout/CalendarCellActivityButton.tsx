import React, { forwardRef, useContext } from 'react'
import { IActivity } from 'api/interfaces/IActivity'
import { getTimeInterval } from 'utils/TimeUtils'
import { CalendarModalContext } from 'pages/binnacle/BinnacleDesktopLayout/CalendarModalContext'
import TooltipTrigger from 'react-popper-tooltip'
import { useTranslation } from 'react-i18next'
import CalendarCellActivityButtonTooltip from 'pages/binnacle/BinnacleDesktopLayout/CalendarCellActivityButtonTooltip'
import { VisuallyHidden, Box, Text } from '@chakra-ui/core'
import { useSettings } from 'pages/settings/Settings.utils'

interface ActivityProps {
  activity: IActivity
  canFocus: boolean
}

const CalendarCellActivityButton: React.FC<ActivityProps> = ({ activity, canFocus }) => {
  const { t } = useTranslation()
  const updateModalData = useContext(CalendarModalContext)
  const settings = useSettings()

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
      tooltip={(tooltip) => <CalendarCellActivityButtonTooltip activity={activity} {...tooltip} />}
      trigger={canFocus ? ['focus', 'hover'] : 'hover'}
      delayShow={canFocus ? 0 : 300}
    >
      {(trigger) => (
        <ActivityButton
          key={activity.id}
          isBillable={activity.billable}
          onClick={handleActivitySelect}
          tabIndex={canFocus ? 0 : -1}
          {...trigger.getTriggerProps({
            ref: trigger.triggerRef
          })}
          aria-describedby="activity_tooltip"
        >
          <Text isTruncated>
            <Text
              as="span"
              fontWeight="600"
              aria-label={`${getTimeInterval(activity.startDate, activity.duration)}, ${
                activity.billable ? `${t('activity_form.billable')},` : ''
              }`}
            >
              {getTimeInterval(activity.startDate, activity.duration)}{' '}
            </Text>
            {settings.showDescription ? (
              activity.description
            ) : (
              <>
                <VisuallyHidden>{t('activity_form.project') + ': '}</VisuallyHidden>
                {activity.project.name}
              </>
            )}
          </Text>
        </ActivityButton>
      )}
    </TooltipTrigger>
  )
}

const ActivityButton = forwardRef<HTMLButtonElement, { isBillable: boolean } & any>(
  ({ isBillable, children, ...props }, ref) => {
    return (
      <Box
        as="button"
        fontSize="xs"
        cursor="pointer"
        color={isBillable ? 'green.600' : 'gray.600'}
        py="4px"
        px="8px"
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
        width="100%"
        border="none"
        display="flex"
        bgColor="transparent"
        borderRadius="5px"
        _hover={{
          color: isBillable ? 'green.800' : 'black',
          bgColor: isBillable ? 'green.100' : 'gray.100'
        }}
        ref={ref}
        {...props}
      >
        {children}
      </Box>
    )
  }
)

export default CalendarCellActivityButton
