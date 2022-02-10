import { Box, Text, useColorModeValue } from '@chakra-ui/react'
import { OpenUpdateActivityFormAction } from 'modules/binnacle/data-access/actions/open-update-activity-form-action'
import type { Activity } from 'modules/binnacle/data-access/interfaces/activity.interface'
import { getTimeInterval } from 'modules/binnacle/data-access/utils/getTimeInterval'
import { ActivityPreview } from 'modules/binnacle/page/BinnacleDesktop/ActivitiesCalendar/CalendarCell/CellActivityButton/ActivityPreview'
import type { FC } from 'react'
import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import { usePopperTooltip } from 'react-popper-tooltip'
import { useAction } from 'shared/arch/hooks/use-action'
import { useGlobalState } from 'shared/arch/hooks/use-global-state'
import { SettingsState } from 'shared/data-access/state/settings-state'
import { observer } from 'mobx-react'
import 'react-popper-tooltip/dist/styles.css'

interface ActivityProps {
  activity: Activity
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

  const timeDescription = getTimeInterval(activity.startDate, activity.duration)

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
    <div>
      <ActivityButton
        key={activity.id}
        isBillable={activity.billable}
        onClick={handleOpenUpdateActivityForm}
        tabIndex={canFocus ? 0 : -1}
        aria-describedby="activity_tooltip"
        ref={setTriggerRef}
      >
        <Text isTruncated aria-label={getA11yLabel()}>
          <b>{timeDescription}</b>{' '}
          {settings.showDescription ? activity.description : activity.project.name}
        </Text>
      </ActivityButton>
      {visible && (
        <ActivityPreview
          activity={activity}
          setTooltipRef={setTooltipRef}
          getTooltipProps={getTooltipProps}
          getArrowProps={getArrowProps}
        />
      )}
    </div>
  )
})

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

ActivityButton.displayName = 'ActivityButton'
