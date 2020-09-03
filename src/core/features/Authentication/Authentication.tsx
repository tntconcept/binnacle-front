import React, { useContext, useState } from 'react'
import { useShowErrorNotification } from 'core/features/Notifications/Notifications'
import { login } from 'api/OAuthAPI'
import { TokenService } from 'services/TokenService'
import { useHistory } from 'react-router-dom'
import { clearAllResourcesCache } from 'use-async-resource/lib/cache'

interface Auth {
  isAuthenticated: boolean
  handleLogin(username: string, password: string): Promise<void>
  handleLogout(): void
}

export const AuthContext = React.createContext<Auth>(undefined!)

export const Authentication: React.FC = (props) => {
  const showErrorNotification = useShowErrorNotification()
  const [authenticated, setAuthenticated] = useState(() =>
    TokenService.tokensArePersisted()
  )
  const history = useHistory()

  const handleLogin = async (username: string, password: string) => {
    try {
      await login(username, password)
      setAuthenticated(true)
    } catch (error) {
      showErrorNotification(error)
      throw error
    }
  }

  const handleLogout = () => {
    clearAllResourcesCache()
    TokenService.removeTokens()

    setAuthenticated(false)
    history.push('/')
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authenticated,
        handleLogin,
        handleLogout
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}

export function useAuthentication() {
  return useContext(AuthContext)
}
