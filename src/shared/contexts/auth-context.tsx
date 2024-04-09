import { GetUserLoggedQry } from '../../features/shared/user/application/get-user-logged-qry'
import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useLayoutEffect,
  useState
} from 'react'
import { useExecuteUseCaseOnMount } from '../arch/hooks/use-execute-use-case-on-mount'

export type AuthState = {
  isLoggedIn?: boolean
  setIsLoggedIn?: Dispatch<SetStateAction<boolean | undefined>>
  canApproval?: boolean
  setCanApproval?: Dispatch<SetStateAction<boolean>>
  canBlock?: boolean
  setCanBlock?: Dispatch<SetStateAction<boolean>>
  checkLoggedUser?: () => Promise<void>
}

const AuthStateContext = createContext<AuthState>({})
AuthStateContext.displayName = 'AuthStateContext'

const APPROVAL_ROLE = 'activity-approval'
const PROJECT_BLOCKER = 'project-blocker'

export const AuthProvider: FC<PropsWithChildren<AuthState>> = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>()
  const [canApproval, setCanApproval] = useState<boolean>(false)
  const [canBlock, setCanBlock] = useState<boolean>(false)
  const {
    isLoading,
    result: userLogged,
    executeUseCase: executeUserLoggedUseCase
  } = useExecuteUseCaseOnMount(GetUserLoggedQry)

  const checkLoggedUser = useCallback(
    async () => await executeUserLoggedUseCase(),
    [executeUserLoggedUseCase]
  )

  useLayoutEffect(() => {
    if (!isLoading) {
      setIsLoggedIn(Boolean(userLogged))
      if (userLogged?.roles?.includes(APPROVAL_ROLE)) setCanApproval(true)
      if (userLogged?.roles?.includes(PROJECT_BLOCKER)) setCanBlock(true)
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
        checkLoggedUser
      }}
    >
      {!isLoading && props.children}
    </AuthStateContext.Provider>
  )
}

export const useAuthContext = (): AuthState => useContext(AuthStateContext)
