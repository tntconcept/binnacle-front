import { useColorModeValue, Box } from '@chakra-ui/react'
import { ActivityApprovalStates } from 'modules/binnacle/data-access/interfaces/activity-approval-state.interface'
import { forwardRef, useMemo } from 'react'
import { TimeUnits } from 'shared/types/time-unit'
import { ActivityWithRenderDays } from '../../types/activity-with-render-days'

export const ActivityItem = forwardRef<
  HTMLButtonElement,
  { activity: ActivityWithRenderDays } & any
>(({ activity, children, ...props }, ref) => {
  const { isBillable, renderDays, renderIndex, interval, approvalState } = activity
  const isInDays = interval.timeUnit === TimeUnits.DAY
  const approvalIsRequired = approvalState !== ActivityApprovalStates.NA
  const isApproved = approvalState === ActivityApprovalStates.ACCEPTED

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
  const bgPendingApproval = useColorModeValue('orange.300', 'orange.700')
  const bgPendingApprovalHover = useColorModeValue('orange.400', 'orange.600')

  const colorApproved = useColorModeValue('white', 'white')
  const colorApprovedHover = useColorModeValue('white', 'white')
  const bgApproved = useColorModeValue('green.400', 'green.700')
  const bgApprovedHover = useColorModeValue('green.500', 'green.600')

  const backgroundColor = useMemo(() => {
    if (!approvalIsRequired && !isBillable && !isInDays) return 'transparent'
    if (!approvalIsRequired && isBillable) return bgBillable

    if (approvalIsRequired && isApproved) return bgApproved

    return bgPendingApproval
  }, [activity])

  const color = useMemo(() => {
    if (!approvalIsRequired && !isBillable && !isInDays) return colorFree
    if (!approvalIsRequired && isBillable) return colorBillable

    if (approvalIsRequired && isApproved) return colorApproved

    return colorPendingApproval
  }, [activity])

  const hoverColor = useMemo(() => {
    if (!approvalIsRequired && !isBillable && !isInDays) return colorFreeHover
    if (!approvalIsRequired && isBillable) return colorBillableHover

    if (approvalIsRequired && isApproved) return colorApprovedHover

    return colorPendingApprovalHover
  }, [activity])

  const hoverBgColor = useMemo(() => {
    if (!approvalIsRequired && !isBillable && !isInDays) return bgFreeHover
    if (!approvalIsRequired && isBillable) return bgBillableHover

    if (approvalIsRequired && isApproved) return bgApprovedHover

    return bgPendingApprovalHover
  }, [activity])

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
      position="absolute"
      marginTop={`${renderIndex * 1.75}rem`}
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
