import {useContext, useMemo} from "react"
import {BinnacleDataContext} from "core/contexts/BinnacleContext/BinnacleDataProvider"
import {isAfter, subMonths} from "date-fns"

const useRecentRoles = (date: Date, activityRoleId?: number) => {
  const {state} = useContext(BinnacleDataContext)
  const isDateValid = isAfter(date, subMonths(new Date(), 1))

  const roleFound = useMemo(() => {
    if (!isDateValid) {
      return undefined
    }

    // gets activity's role or last imputed role
    if (activityRoleId || state.lastImputedRole) {
      const roleId = activityRoleId || state.lastImputedRole?.id
      return state.recentRoles.find(r => r.id === roleId)
    }
    return undefined
  }, [isDateValid, activityRoleId, state.lastImputedRole, state.recentRoles])

  return roleFound
}

export default useRecentRoles
