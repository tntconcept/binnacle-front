import { Icon } from '@chakra-ui/icons'
import { Box, Flex, Text } from '@chakra-ui/react'
import { OfficeBuildingIcon, UserIcon, UsersIcon } from '@heroicons/react/outline'
import { useTranslation } from 'react-i18next'

type Props = {
  color: string
  labels: string[]
  total?: number | string
}

export const LegendItem: React.FC<Props> = ({ labels, color, total }) => {
  const { t } = useTranslation()
  const isProjectRoleLabel = labels.length > 1

  const renderIcon = (index: number) => {
    const isOrganizationLabel = index === 0
    const isProjectLabel = index === 1
    const isProjectRoleLabel = index === 2
    if (isOrganizationLabel) {
      return (
        <Icon
          as={OfficeBuildingIcon}
          aria-label={`${t('activity_form.organization')} :`}
          color="gray.400"
          mr={1}
        />
      )
    }
    if (isProjectLabel) {
      return (
        <Icon
          as={UsersIcon}
          aria-label={`${t('activity_form.project')} :`}
          color="gray.400"
          mr={1}
        />
      )
    }
    if (isProjectRoleLabel) {
      return (
        <Icon as={UserIcon} aria-label={`${t('activity_form.role')} :`} color="gray.400" mr={1} />
      )
    }
  }

  return (
    <Flex gap={4} alignItems="center">
      <Box w={4} h={4} backgroundColor={color} />
      <Flex flexDirection="column">
        {labels.map((label, i) => (
          <Text key={i} maxWidth="27ch" isTruncated>
            {isProjectRoleLabel && renderIcon(i)}
            {label}
          </Text>
        ))}
        {total && <Text fontSize="sm">{total}</Text>}
      </Flex>
    </Flex>
  )
}
