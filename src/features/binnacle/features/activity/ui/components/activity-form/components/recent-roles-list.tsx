import { SimpleGrid } from '@chakra-ui/react'
import { GetRecentProjectRolesQry } from 'features/binnacle/features/project-role/application/get-recent-project-roles-qry'
import { ProjectRole } from 'features/binnacle/features/project-role/domain/project-role'
import { useEffect } from 'react'
import { useExecuteUseCaseOnMount } from 'shared/arch/hooks/use-execute-use-case-on-mount'
import RecentRoleCard from './recent-role-card'

interface Props {
  projectRole?: ProjectRole
  onSelect: (projectRole: ProjectRole) => void
}

function RecentRolesList(props: Props) {
  const { projectRole, onSelect } = props
  const { isLoading, result: recentRoles } = useExecuteUseCaseOnMount(GetRecentProjectRolesQry)

  useEffect(() => {
    if (!projectRole && !isLoading && recentRoles) {
      onSelect(recentRoles[0])
    }
  }, [projectRole, isLoading, recentRoles])

  return (
    <SimpleGrid columns={[1, 2]} spacing={2}>
      {recentRoles &&
        recentRoles.map((role) => (
          <RecentRoleCard
            key={role.id}
            role={role}
            checked={role.id === projectRole?.id}
            onChange={() => onSelect(role)}
          />
        ))}
    </SimpleGrid>
  )
}

export default RecentRolesList
