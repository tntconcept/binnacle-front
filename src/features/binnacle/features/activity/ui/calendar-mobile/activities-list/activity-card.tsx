import { Box, Divider, Flex, Icon, Text, useColorModeValue } from '@chakra-ui/react'
import { ClockIcon, UsersIcon } from '@heroicons/react/24/outline'
import { GetUserSettingsQry } from '../../../../../../shared/user/features/settings/application/get-user-settings-qry'
import { FC, PropsWithChildren, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useExecuteUseCaseOnMount } from '../../../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { TimeUnits } from '../../../../../../../shared/types/time-unit'
import { chrono, getHumanizedDuration } from '../../../../../../../shared/utils/chrono'
import { Activity } from '../../../domain/activity'
import { ActivityApprovalStates } from '../../../domain/activity-approval-state'
import { getDurationByMinutes } from '../../../utils/get-duration'
import { getTimeInterval } from '../../../utils/get-time-interval'
import { useCalendarContext } from '../../contexts/calendar-context'

interface Props {
  activity: Activity
}

export const ActivityCard: FC<Props> = ({ activity }) => {
  const { t } = useTranslation()
  const { shouldUseDecimalTimeFormat } = useCalendarContext()
  useExecuteUseCaseOnMount(GetUserSettingsQry)
  const activityIsInMinutes = activity.interval.timeUnit === TimeUnits.MINUTES
  const activityIsApproved = activity.approval.state === ActivityApprovalStates.ACCEPTED
  const activityIsPendingApproval = activity.approval.state === ActivityApprovalStates.PENDING
  const activityIsBillable = activity.billable

  const activityCardTitle = useMemo(() => {
    if (activityIsPendingApproval) return t('activity_form.state_pending')
    if (activityIsBillable) return t('activity_form.billable')
    if (activityIsApproved) return t('activity_form.state_approved')

    return ''
  }, [activityIsApproved, activityIsBillable, activityIsPendingApproval, t])

  const getActivityPeriod = useCallback(() => {
    const {
      interval: { start, end, timeUnit }
    } = activity

    const timeInterval = activityIsInMinutes
      ? getTimeInterval(start, activity.interval.duration)
      : `${chrono(start).format('dd/MM/yyyy')} - ${chrono(end).format('dd/MM/yyyy')}`

    const duration = activityIsInMinutes
      ? getDurationByMinutes(activity.interval.duration, shouldUseDecimalTimeFormat)
      : getHumanizedDuration({
          duration: activity.interval.duration,
          abbreviation: true,
          timeUnit
        })
    return `${timeInterval} (${duration})`
  }, [activity, activityIsInMinutes, shouldUseDecimalTimeFormat])

  const activityBorderColor = useMemo(() => {
    if (activityIsPendingApproval) return 'gray.500'
    if (activityIsBillable) return 'green.600'
    if (activityIsApproved) return 'blue.700'

    return 'gray.400'
  }, [activityIsBillable, activityIsPendingApproval, activityIsApproved])

  return (
    <Box
      data-testid="activity_card"
      m={4}
      position="relative"
      borderRadius="md"
      p="18px 10px 10px"
      border="1px solid"
      borderColor={activityBorderColor}
    >
      {(activityIsPendingApproval || activityIsBillable || activityIsApproved) && (
        <ActivityCardTitle
          isBillable={activityIsBillable}
          isPending={activityIsPendingApproval}
          isAccepted={activityIsApproved}
        >
          {activityCardTitle}
        </ActivityCardTitle>
      )}
      <Box position="relative">
        <OrganizationText>{activity.organization.name}</OrganizationText>
        <Flex align="baseline" fontFamily="'Work sans', 'serif'" fontSize="sm" mb={1}>
          <Text fontSize="sm" maxWidth="18ch" isTruncated display="inline-block">
            <Icon as={UsersIcon} color="gray.400" mr={1} verticalAlign="text-bottom" />
            {activity.project.name}
          </Text>
          <Dot />
          <Text fontSize="sm" maxWidth="18ch" isTruncated display="inline-block">
            {activity.projectRole.name}
          </Text>
        </Flex>
        <Text fontSize="sm">
          <Icon as={ClockIcon} color="gray.400" verticalAlign="text-bottom" /> {getActivityPeriod()}
        </Text>
      </Box>
      <Divider my={2} borderColor="gray.400" />
      <Text isTruncated noOfLines={3} fontSize="sm">
        {activity.description}
      </Text>
    </Box>
  )
}

const OrganizationText: FC<PropsWithChildren> = (props) => {
  return (
    <Text
      as="span"
      position="absolute"
      top="-12px"
      maxWidth="45ch"
      ml="20px"
      color="gray.500"
      fontSize="10px"
      textTransform="uppercase"
      fontFamily="'Work sans', 'serif'"
      isTruncated
    >
      {props.children}
    </Text>
  )
}

type ActivityCardTitleProps = {
  isBillable?: boolean
  isPending?: boolean
  isAccepted?: boolean
}
const ActivityCardTitle: FC<PropsWithChildren<ActivityCardTitleProps>> = (props) => {
  const { isPending = false, isAccepted = false, isBillable = false } = props

  const billableBgColor = useColorModeValue('white', 'gray.800')
  const billableColor = useColorModeValue('green.800', 'green.600')

  const pendingBgColor = useColorModeValue('white', 'gray.800')
  const pendingColor = useColorModeValue('gray.500', 'gray.500')

  const acceptedBgColor = useColorModeValue('white', 'white')
  const acceptedColor = useColorModeValue('blue.700', 'blue.700')

  const color = useMemo(() => {
    if (isPending) return pendingColor
    if (isBillable) return billableColor
    if (isAccepted) return acceptedColor

    return 'gray.100'
  }, [acceptedColor, billableColor, isAccepted, isBillable, isPending, pendingColor])

  const bgColor = useMemo(() => {
    if (isPending) return pendingBgColor
    if (isBillable) return billableBgColor
    if (isAccepted) return acceptedBgColor

    return 'gray.100'
  }, [acceptedBgColor, billableBgColor, isAccepted, isBillable, isPending, pendingBgColor])

  return (
    <Text
      as="span"
      position="absolute"
      top="-2px"
      right="16px"
      height="10px"
      px="5px"
      color={color}
      fontSize="8px"
      textTransform="uppercase"
      letterSpacing="1px"
      fontWeight="bold"
      fontFamily="'Work sans', 'serif'"
      bgColor={bgColor}
      lineHeight="0.38"
    >
      {props.children}
    </Text>
  )
}

const Dot: FC = () => {
  return (
    <Text
      as="span"
      fontSize="sm"
      textAlign="center"
      px="3px"
      position="relative"
      top="-3px"
      fontWeight="bold"
    >
      .
    </Text>
  )
}
