import {useContext, useMemo} from "react"
import {BinnacleDataContext} from "core/contexts/BinnacleContext/BinnacleDataProvider"

const useRecentRoles = (activityRoleId?: number) => {
  const {state} = useContext(BinnacleDataContext)

  const roleFound = useMemo(() => {
    if (activityRoleId || state.lastImputedRole) {
      const roleId = activityRoleId || state.lastImputedRole?.id
      return state.recentRoles.find(r => r.id === roleId)
    }
    return undefined
  }, [activityRoleId, state.lastImputedRole, state.recentRoles])

  return roleFound
}

export default useRecentRoles
