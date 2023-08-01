import { Flex, Icon, Text } from '@chakra-ui/react'
import { BuildingOfficeIcon, UserIcon, UsersIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'

interface Props {
  organization: string
  project: string
  role: string
}

export const ProjectRoleCard = ({ organization, project, role }: Props) => {
  const { t } = useTranslation()

  return (
    <Flex direction="column">
      <Text as="h2" maxWidth="27ch" isTruncated>
        <Icon
          as={BuildingOfficeIcon}
          aria-label={t('activity_form.organization') + ':'}
          color="gray.400"
          mr={1}
        />
        {organization}
      </Text>
      <Text as="h3" maxWidth="27ch" isTruncated>
        <Icon
          as={UsersIcon}
          aria-label={t('activity_form.project') + ':'}
          color="gray.400"
          mr={1}
        />
        {project}
      </Text>
      <Text as="h4" maxWidth="27ch" isTruncated>
        <Icon as={UserIcon} aria-label={t('activity_form.role') + ':'} color="gray.400" mr={1} />
        {role}
      </Text>
    </Flex>
  )
}
