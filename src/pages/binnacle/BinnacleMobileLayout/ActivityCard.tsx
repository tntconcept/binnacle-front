import React from 'react'
import { ReactComponent as ClockIcon } from 'heroicons/outline/clock.svg'
import { ReactComponent as UsersIcon } from 'heroicons/outline/users.svg'
import { IActivity } from 'api/interfaces/IActivity'
import { useTranslation } from 'react-i18next'
import { getDuration, getTimeInterval } from 'utils/TimeUtils'
import { useSettings } from 'pages/settings/Settings.utils'
import { Icon, Text, Divider, Box, Flex, useColorModeValue } from '@chakra-ui/core'

interface IProps {
  activity: IActivity
}

const ActivityCard: React.FC<IProps> = ({ activity }) => {
  const { t } = useTranslation()
  const settings = useSettings()

  const getTime = () => {
    const timeInterval = getTimeInterval(activity.startDate, activity.duration)
    const duration = getDuration(activity.duration, settings.useDecimalTimeFormat)
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
      <Box>
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
}

const OrganizationText: React.FC = (props) => {
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

const Billable: React.FC = (props) => {
  const bgColor = useColorModeValue('white', 'gray.800')

  return (
    <Text
      as="span"
      position="absolute"
      top="-2px"
      right="16px"
      height="10px"
      px="5px"
      color="green.800"
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

const Dot: React.FC = (props) => {
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
