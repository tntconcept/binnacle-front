import { GetUserLoggedQry } from 'features/user/application/get-user-logged-qry'
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
import { useExecuteUseCaseOnMount } from 'shared/arch/hooks/use-execute-use-case-on-mount'

export type AuthState = {
  isLoggedIn?: boolean
  setIsLoggedIn?: Dispatch<SetStateAction<boolean | undefined>>
  canApproval?: boolean
  setCanApproval?: Dispatch<SetStateAction<boolean>>
}

const AuthStateContext = createContext<AuthState>({})
AuthStateContext.displayName = 'AuthStateContext'

const APPROVAL_ROLE = 'activity-approval'

export const AuthProvider: FC<PropsWithChildren<AuthState>> = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>()
  const [canApproval, setCanApproval] = useState<boolean>(false)
  const { isLoading, result: userLogged } = useExecuteUseCaseOnMount(GetUserLoggedQry)

  useLayoutEffect(() => {
    if (!isLoading) {
      setIsLoggedIn(Boolean(userLogged))
      if (userLogged?.roles?.includes(APPROVAL_ROLE)) setCanApproval(true)
    }
  }, [isLoading, userLogged])

  return (
    <AuthStateContext.Provider value={{ isLoggedIn, setIsLoggedIn, canApproval, setCanApproval }}>
      {!isLoading && props.children}
    </AuthStateContext.Provider>
  )
}

export const useAuthContext = (): AuthState => useContext(AuthStateContext)
