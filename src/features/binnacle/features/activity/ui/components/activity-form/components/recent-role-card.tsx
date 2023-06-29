import { Box, Flex, useColorModeValue, VisuallyHiddenInput } from '@chakra-ui/react'
import { ProjectRole } from 'features/binnacle/features/project-role/domain/project-role'
import type { FC } from 'react'
import { useEffect, useRef } from 'react'
import ProjectRoleCard from '../../project-role-card/project-role-card'

interface Props {
  projectRole: ProjectRole
  checked: boolean
  onChange: (role: ProjectRole) => void
}

const RecentRoleCard: FC<Props> = (props) => {
  const { projectRole, checked = false, onChange } = props
  const id = projectRole.id.toString()
  const borderColorChecked = useColorModeValue('#1f1c53', 'gray.500')
  const borderColorUnchecked = useColorModeValue('#D0CFE3', 'transparent')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <Box position="relative">
      <VisuallyHiddenInput
        ref={inputRef}
        id={id}
        name="recent_projects"
        type="radio"
        value={projectRole.id}
        checked={checked}
        onChange={() => onChange(projectRole)}
        data-testid={'role_' + projectRole.id}
      />
      <Flex
        as="label"
        htmlFor={id}
        d="inline-flex"
        py="6px"
        px="8px"
        width="full"
        flexDir="row"
        justify="space-between"
        borderStyle="solid"
        borderWidth="1px"
        borderColor={checked ? borderColorChecked : borderColorUnchecked}
        boxShadow={checked ? `0 0 0 1px ${borderColorChecked}` : 'unset'}
        borderRadius="4px"
        fontSize="sm"
        userSelect="none"
        cursor="pointer"
        outline="none"
      >
        <ProjectRoleCard
          organization={projectRole.organization.name}
          project={projectRole.project.name}
          role={projectRole.name}
        />
      </Flex>
    </Box>
  )
}

export default RecentRoleCard
