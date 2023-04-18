import { Box, Icon, Text, useColorModeValue, VisuallyHidden } from '@chakra-ui/react'
import { OfficeBuildingIcon, UserIcon, UsersIcon } from '@heroicons/react/outline'
import { ProjectRole } from 'features/binnacle/features/project-role/domain/project-role'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  projectRole: ProjectRole
  checked: boolean
  onChange: (role: ProjectRole) => void
}

const RecentRoleCard: FC<Props> = (props) => {
  const { projectRole, checked = false, onChange } = props
  const { t } = useTranslation()
  const borderColorChecked = useColorModeValue('#1f1c53', 'gray.500')
  const borderColorUncheked = useColorModeValue('#D0CFE3', 'transparent')

  const id = projectRole.id.toString()

  return (
    <Box position="relative">
      <VisuallyHidden
        as="input"
        id={id}
        name="recent_projects"
        type="radio"
        value={projectRole.id}
        checked={checked}
        // TODO
        // onChange={(newProject) => onChange(newProject)}
        data-testid={'role_' + projectRole.id}
      />
      <Box
        as="label"
        htmlFor={id}
        d="inline-flex"
        py="6px"
        px="8px"
        width="full"
        flexDir="column"
        borderStyle="solid"
        borderWidth="1px"
        borderColor={checked ? borderColorChecked : borderColorUncheked}
        boxShadow={checked ? `0 0 0 1px ${borderColorChecked}` : 'unset'}
        borderRadius="4px"
        fontSize="sm"
        userSelect="none"
        cursor="pointer"
        outline="none"
      >
        <Text maxWidth="27ch" isTruncated>
          <Icon
            as={OfficeBuildingIcon}
            aria-label={t('activity_form.organization') + ':'}
            color="gray.400"
            mr={1}
          />
          {projectRole.organization.name}
        </Text>
        <Text maxWidth="27ch" isTruncated>
          <Icon
            as={UsersIcon}
            aria-label={t('activity_form.project') + ':'}
            color="gray.400"
            mr={1}
          />
          {projectRole.project.name}
        </Text>
        <Text maxWidth="27ch" isTruncated>
          <Icon as={UserIcon} aria-label={t('activity_form.role') + ':'} color="gray.400" mr={1} />
          {projectRole.name}
        </Text>
      </Box>
    </Box>
  )
}

export default RecentRoleCard
