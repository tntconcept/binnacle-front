import { Box, useColorModeValue } from '@chakra-ui/react'
import { ActivityApprovalStates } from 'features/binnacle/features/activity/domain/activity-approval-state'
import { forwardRef } from 'react'
import { TimeUnits } from 'shared/types/time-unit'
import { ActivityWithRenderDays } from '../../types/activity-with-render-days'

export const ActivityItem = forwardRef<
  HTMLButtonElement,
  { activity: ActivityWithRenderDays } & any
>(({ activity, children, ...props }, ref) => {
  const { billable, renderDays, approvalState, interval } = activity

  const colorFree = useColorModeValue('gray.600', 'rgb(226, 232, 240)')
  const colorFreeHover = useColorModeValue('rgb(26, 32, 44)', 'rgb(226, 232, 240)')
  // const bgFree = useColorModeValue('rgb(237, 242, 247)', 'rgba(226, 232, 240, 0.16)')
  const bgFreeHover = useColorModeValue('rgb(237, 242, 247)', 'rgba(226, 232, 240, 0.16)')

  const colorBillable = useColorModeValue('green.600', 'green.200')
  const colorBillableHover = useColorModeValue('green.800', 'green.300')
  const bgBillable = useColorModeValue('green.100', 'rgba(154,230,180,0.16)')
  const bgBillableHover = useColorModeValue('green.100', 'rgba(154,230,180,0.16)')

  const colorPendingApproval = useColorModeValue('black', 'black')
  const colorPendingApprovalHover = useColorModeValue('black', 'black')
  const bgPendingApproval = useColorModeValue('gray.300', 'gray.500')
  const bgPendingApprovalHover = useColorModeValue('gray.400', 'gray.400')

  const colorApproved = useColorModeValue('white', 'white')
  const colorApprovedHover = useColorModeValue('white', 'white')
  const bgApproved = useColorModeValue('blue.700', 'blue.700')
  const bgApprovedHover = useColorModeValue('blue.500', 'blue.600')

  const approvalIsRequired = approvalState !== ActivityApprovalStates.NA
  const isApproved = !approvalIsRequired || approvalState === ActivityApprovalStates.ACCEPTED
  const isInDays = interval.timeUnit === TimeUnits.DAYS

  const normalActivity = !approvalIsRequired && !billable
  const billableActivity = billable && (!approvalIsRequired || isApproved)
  const pendingApprovalActivity = approvalIsRequired && !isApproved

  const backgroundColor = (() => {
    if (!isInDays || normalActivity) return 'transparent'
    if (pendingApprovalActivity) return bgPendingApproval
    if (billableActivity) return bgBillable

    return bgApproved
  })()

  const color = (() => {
    if (normalActivity) return colorFree
    if (pendingApprovalActivity) return colorPendingApproval
    if (billableActivity) return colorBillable

    return colorApproved
  })()

  const hoverColor = (() => {
    if (normalActivity) return colorFreeHover
    if (pendingApprovalActivity) return colorPendingApprovalHover
    if (billableActivity) return colorBillableHover

    return colorApprovedHover
  })()

  const hoverBgColor = (() => {
    if (normalActivity) return bgFreeHover
    if (pendingApprovalActivity) return bgPendingApprovalHover
    if (billableActivity) return bgBillableHover

    return bgApprovedHover
  })()

  return (
    <Box
      as="button"
      fontSize="xs"
      cursor="pointer"
      color={color}
      py="4px"
      px="8px"
      overflow="hidden"
      textOverflow="ellipsis"
      whiteSpace="nowrap"
      width={`calc(${renderDays * 100}% - 1em)`}
      position={isInDays ? 'absolute' : 'static'}
      border="none"
      display="flex"
      bgColor={backgroundColor}
      borderRadius="5px"
      zIndex={1}
      _hover={{
        color: hoverColor,
        bgColor: hoverBgColor
      }}
      ref={ref}
      {...props}
    >
      {children}
    </Box>
  )
})

ActivityItem.displayName = 'ActivityButton'
