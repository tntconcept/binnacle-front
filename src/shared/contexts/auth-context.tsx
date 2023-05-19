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
}

const AuthStateContext = createContext<AuthState>({})
AuthStateContext.displayName = 'AuthStateContext'

export const AuthProvider: FC<PropsWithChildren<AuthState>> = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>()
  const { isLoading, result: userLogged } = useExecuteUseCaseOnMount(GetUserLoggedQry)

  useLayoutEffect(() => {
    if (!isLoading) {
      setIsLoggedIn(Boolean(userLogged))
    }
  }, [isLoading, userLogged])

  return (
    <AuthStateContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {!isLoading && props.children}
    </AuthStateContext.Provider>
  )
}

export const useAuthContext = (): AuthState => useContext(AuthStateContext)
