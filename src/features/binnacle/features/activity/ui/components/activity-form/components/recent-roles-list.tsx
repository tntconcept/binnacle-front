import { SimpleGrid } from '@chakra-ui/react'
import { GetRecentProjectRolesQry } from '../../../../../project-role/application/get-recent-project-roles-qry'
import { ProjectRole } from '../../../../../project-role/domain/project-role'
import { FC, useEffect } from 'react'
import { useExecuteUseCaseOnMount } from '../../../../../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import { RecentRoleCard } from './recent-role-card'
import { useCalendarContext } from '../../../contexts/calendar-context'

interface Props {
  projectRole?: ProjectRole
  onEmptyList: () => void
  onChange: (projectRole: ProjectRole) => void
}

export const RecentRolesList: FC<Props> = (props) => {
  const { onEmptyList, projectRole, onChange } = props
  const { selectedDate } = useCalendarContext()
  const { isLoading, result: recentRoles } = useExecuteUseCaseOnMount(
    GetRecentProjectRolesQry,
    selectedDate.getFullYear()
  )

  useEffect(() => {
    if (!projectRole && !isLoading) {
      if (!recentRoles || recentRoles.length === 0) return onEmptyList()

      onChange(recentRoles[0])
    }
  }, [projectRole, isLoading, recentRoles])

  return (
    <SimpleGrid columns={[1, 2]} spacing={2}>
      {recentRoles &&
        recentRoles.map((recentRole) => (
          <RecentRoleCard
            key={recentRole.id}
            projectRole={recentRole}
            checked={recentRole.id === projectRole?.id}
            onChange={onChange}
          />
        ))}
    </SimpleGrid>
  )
}
