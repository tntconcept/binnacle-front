import { SimpleGrid } from '@chakra-ui/react'
import RecentRoleCard from 'modules/binnacle/components/ActivityForm/components/RecentRoleCard'
import type { RecentRole } from 'modules/binnacle/data-access/interfaces/recent-role'
import { BinnacleState } from 'modules/binnacle/data-access/state/binnacle-state'
import { useGlobalState } from 'shared/arch/hooks/use-global-state'

interface Props {
  recentRole: RecentRole
  onSelectRoleCard: (role: RecentRole) => void
}

function RecentRolesList(props: Props) {
  const { recentRoles } = useGlobalState(BinnacleState)

  return (
    <SimpleGrid columns={[1, 2]} spacing={2}>
      {recentRoles.map((role) => (
        <RecentRoleCard
          key={role.id}
          role={role}
          checked={role.id === props.recentRole.id}
          onChange={props.onSelectRoleCard}
        />
      ))}
    </SimpleGrid>
  )
}

export default RecentRolesList
