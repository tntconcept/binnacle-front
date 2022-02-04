import { Box, Divider, Flex, Icon, Text, useColorModeValue } from '@chakra-ui/react'
import { ClockIcon, UsersIcon } from '@heroicons/react/outline'
import { observer } from 'mobx-react'
import type { Activity } from 'modules/binnacle/data-access/interfaces/activity.interface'
import { getDurationByMinutes } from 'modules/binnacle/data-access/utils/getDuration'
import { getTimeInterval } from 'modules/binnacle/data-access/utils/getTimeInterval'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useGlobalState } from 'shared/arch/hooks/use-global-state'
import { SettingsState } from 'shared/data-access/state/settings-state'

interface IProps {
  activity: Activity
}

const ActivityCard: FC<IProps> = observer(({ activity }) => {
  const { t } = useTranslation()
  const { settings } = useGlobalState(SettingsState)

  const getTime = () => {
    const timeInterval = getTimeInterval(activity.startDate, activity.duration)
    const duration = getDurationByMinutes(activity.duration, settings.useDecimalTimeFormat)
    return `${timeInterval} (${duration})`
  }

  return (
    <Box
      data-testid="activity_card"
      m={4}
      position="relative"
      borderRadius="md"
      p="18px 10px 10px"
      border="1px solid"
      borderColor={activity.billable ? 'green.600' : 'gray.400'}
    >
      {activity.billable && <Billable>{t('activity_form.billable')}</Billable>}
      <Box position="relative">
        <OrganizationText>{activity.organization.name}</OrganizationText>
        <Flex align="baseline" fontFamily="'Work sans', 'serif'" fontSize="sm" mb={1}>
          <Text fontSize="sm" maxWidth="18ch" isTruncated d="inline-block">
            <Icon as={UsersIcon} color="gray.400" mr={1} verticalAlign="text-bottom" />
            {activity.project.name}
          </Text>
          <Dot />
          <Text fontSize="sm" maxWidth="18ch" isTruncated d="inline-block">
            {activity.projectRole.name}
          </Text>
        </Flex>
        <Text fontSize="sm">
          <Icon as={ClockIcon} color="gray.400" verticalAlign="text-bottom" /> {getTime()}
        </Text>
      </Box>
      <Divider my={2} borderColor="gray.400" />
      <Text isTruncated noOfLines={3} fontSize="sm">
        {activity.description}
      </Text>
    </Box>
  )
})

const OrganizationText: FC = (props) => {
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

const Billable: FC = (props) => {
  const bgColor = useColorModeValue('white', 'gray.800')
  const color = useColorModeValue('green.800', 'green.600')

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

const Dot: FC = (props) => {
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

export default ActivityCard
