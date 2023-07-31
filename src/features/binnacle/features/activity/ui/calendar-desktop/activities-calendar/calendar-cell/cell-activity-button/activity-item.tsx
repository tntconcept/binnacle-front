import { Box, Icon, useColorModeValue } from '@chakra-ui/react'
import { CheckCircleIcon, QuestionMarkCircleIcon } from '@heroicons/react/solid'
import { ActivityApprovalStates } from '../../../../../domain/activity-approval-state'
import { forwardRef, PropsWithChildren } from 'react'
import { TimeUnits } from '../../../../../../../../../shared/types/time-unit'
import { ActivityWithRenderDays } from '../../../../../domain/activity-with-render-days'

interface Props {
  activity: ActivityWithRenderDays
  tabIndex: number
  onClick: (event: MouseEvent) => void
}

export const ActivityItem = forwardRef<HTMLDivElement, PropsWithChildren<Props>>(
  ({ activity, children, ...props }, ref) => {
    const { billable, renderDays, approval, interval } = activity

    const colorFree = useColorModeValue('gray.600', 'white')
    const colorFreeHover = useColorModeValue('rgb(26, 32, 44)', 'white')
    const bgFree = useColorModeValue('gray.300', 'gray.600')
    const bgFreeHover = useColorModeValue('rgb(237, 242, 247)', 'gray.500')

    const colorBillable = useColorModeValue('green.600', 'green.200')
    const colorBillableHover = useColorModeValue('green.800', 'green.300')
    const bgBillable = useColorModeValue('green.100', '#324042')
    const bgBillableHover = useColorModeValue('green.200', '#405350')

    const colorPendingApproval = useColorModeValue('gray.600', 'white')
    const colorPendingApprovalHover = useColorModeValue('rgb(26, 32, 44)', 'white')
    const bgPendingApproval = useColorModeValue('gray.300', 'gray.600')
    const bgPendingApprovalHover = useColorModeValue('gray.400', 'gray.500')

    const colorApproved = useColorModeValue('gray.600', 'white')
    const colorApprovedHover = useColorModeValue('white', 'white')
    const bgApproved = useColorModeValue('blue.700', 'blue.500')
    const bgApprovedHover = useColorModeValue('blue.500', 'blue.600')

    const colorApprovedInDays = useColorModeValue('white', 'white')

    const approvalIsRequired = approval.state !== ActivityApprovalStates.NA
    const isApproved = approval.state === ActivityApprovalStates.ACCEPTED
    const isInDays =
      interval.timeUnit === TimeUnits.DAYS || interval.timeUnit === TimeUnits.NATURAL_DAYS

    const normalActivity = !approvalIsRequired && !billable
    const billableActivity = billable && (!approvalIsRequired || isApproved)
    const pendingApprovalActivity = approvalIsRequired && !isApproved

    const backgroundColor = (() => {
      if (!isInDays) return 'transparent'
      if (normalActivity) return bgFree
      if (pendingApprovalActivity) return bgPendingApproval
      if (billableActivity) return bgBillable

      return bgApproved
    })()

    const color = (() => {
      if (normalActivity) return colorFree
      if (pendingApprovalActivity) return colorPendingApproval
      if (billableActivity) return colorBillable
      if (isApproved && isInDays) return colorApprovedInDays

      return colorApproved
    })()

    const hoverColor = (() => {
      if (normalActivity) return colorFreeHover
      if (billableActivity) return colorBillableHover
      if (pendingApprovalActivity && isInDays) return colorPendingApprovalHover
      if (isApproved && isInDays) return colorApprovedHover

      return colorFreeHover
    })()

    const hoverBgColor = (() => {
      if (normalActivity) return bgFreeHover
      if (pendingApprovalActivity && isInDays) return bgPendingApprovalHover
      if (billableActivity) return bgBillableHover
      if (isApproved && isInDays) return bgApprovedHover

      return bgFreeHover
    })()

    return (
      <Box
        as="button"
        fontSize="xs"
        cursor="pointer"
        color={color}
        py="4px"
        px="8px"
        gap="4px"
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
        ref={ref as any}
        {...props}
        onClick={props.onClick as any}
      >
        {isApproved && <Icon as={CheckCircleIcon} fontSize="md" />}
        {pendingApprovalActivity && <Icon as={QuestionMarkCircleIcon} fontSize="md" />}
        {children}
      </Box>
    )
  }
)

ActivityItem.displayName = 'ActivityButton'
