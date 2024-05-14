import { GetUserLoggedQry } from '../../features/shared/user/application/get-user-logged-qry'
import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useLayoutEffect,
  useState
} from 'react'
import { useExecuteUseCaseOnMount } from '../arch/hooks/use-execute-use-case-on-mount'
import { User } from '../../features/shared/user/domain/user'

export type AuthState = {
  isLoggedIn?: boolean
  setIsLoggedIn?: Dispatch<SetStateAction<boolean | undefined>>
  canApproval?: boolean
  setCanApproval?: Dispatch<SetStateAction<boolean>>
  canBlock?: boolean
  setCanBlock?: Dispatch<SetStateAction<boolean>>
  isSubcontractedManager?: boolean
  setIsSubcontractedManager?: Dispatch<SetStateAction<boolean>>
  checkLoggedUser?: (userLogged: User) => void
}

const AuthStateContext = createContext<AuthState>({})
AuthStateContext.displayName = 'AuthStateContext'

const APPROVAL_ROLE = 'activity-approval'
const PROJECT_BLOCKER = 'project-blocker'
const SUBCONTRACTED_ACTIVITY_MANAGER = 'subcontracted-activity-manager'

export const AuthProvider: FC<PropsWithChildren<AuthState>> = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>()
  const [canApproval, setCanApproval] = useState<boolean>(false)
  const [canBlock, setCanBlock] = useState<boolean>(false)
  const [isSubcontractedManager, setIsSubcontractedManager] = useState<boolean>(false)
  const { isLoading, result: userLogged } = useExecuteUseCaseOnMount(GetUserLoggedQry)

  const checkLoggedUser = (userLogged: User | undefined) => {
    setIsLoggedIn(Boolean(userLogged))
    if (userLogged?.roles?.includes(APPROVAL_ROLE)) setCanApproval(true)
    if (userLogged?.roles?.includes(PROJECT_BLOCKER)) setCanBlock(true)
    if (userLogged?.roles?.includes(SUBCONTRACTED_ACTIVITY_MANAGER)) setIsSubcontractedManager(true)
  }

  useLayoutEffect(() => {
    if (!isLoading) {
      setIsLoggedIn(Boolean(userLogged))
      if (userLogged?.roles?.includes(APPROVAL_ROLE)) setCanApproval(true)
      if (userLogged?.roles?.includes(PROJECT_BLOCKER)) setCanBlock(true)
      if (userLogged?.roles?.includes(SUBCONTRACTED_ACTIVITY_MANAGER))
        setIsSubcontractedManager(true)
      checkLoggedUser(userLogged)
    }
  }, [isLoading, userLogged])

  return (
    <AuthStateContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        canApproval,
        setCanApproval,
        canBlock,
        setCanBlock,
        isSubcontractedManager,
        setIsSubcontractedManager,
        checkLoggedUser
      }}
    >
      {!isLoading && props.children}
    </AuthStateContext.Provider>
  )
}

export const useAuthContext = (): AuthState => useContext(AuthStateContext)
