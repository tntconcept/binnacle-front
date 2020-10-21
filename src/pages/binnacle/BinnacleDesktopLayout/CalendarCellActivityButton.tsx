import React, { forwardRef, useContext } from 'react'
import { IActivity } from 'api/interfaces/IActivity'
import { getTimeInterval } from 'utils/TimeUtils'
import { CalendarModalContext } from 'pages/binnacle/BinnacleDesktopLayout/CalendarModalContext'
import TooltipTrigger from 'react-popper-tooltip'
import { useTranslation } from 'react-i18next'
import CalendarCellActivityButtonTooltip from 'pages/binnacle/BinnacleDesktopLayout/CalendarCellActivityButtonTooltip'
import { VisuallyHidden, Box, Text, useColorModeValue } from '@chakra-ui/core'
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
    const colorFree = useColorModeValue('gray.600', 'rgb(226, 232, 240)')
    const colorFreeHover = useColorModeValue('rgb(26, 32, 44)', 'rgb(226, 232, 240)')
    const bgFree = useColorModeValue('rgb(237, 242, 247)', 'rgba(226, 232, 240, 0.16)')

    const colorBillable = useColorModeValue('green.600', 'green.200')
    const colorBillableHover = useColorModeValue('green.800', 'green.300')
    const bgBillable = useColorModeValue('green.100', 'rgba(154,230,180,0.16)')

    return (
      <Box
        as="button"
        fontSize="xs"
        cursor="pointer"
        color={isBillable ? colorBillable : colorFree}
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
          color: isBillable ? colorBillableHover : colorFreeHover,
          bgColor: isBillable ? bgBillable : bgFree
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
