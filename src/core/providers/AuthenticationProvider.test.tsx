import React from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { AuthenticationProvider, useAuthentication } from 'core/providers/AuthenticationProvider'
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { login } from 'core/api/oauth'
import { TokenService } from 'core/services/TokenService'
import { clearAllResourcesCache } from 'use-async-resource/lib/cache'

jest.mock('core/api/oauth')
jest.mock('use-async-resource/lib/cache')

describe('Authentication hook', () => {
  function renderAuthenticationHook() {
    const history = createBrowserHistory()

    const wrapper: React.FC = ({ children }) => (
      <Router history={history}>
        <AuthenticationProvider>{children}</AuthenticationProvider>
      </Router>
    )

    const hookUtils = renderHook(() => useAuthentication(), { wrapper })

    return {
      ...hookUtils,
      history
    }
  }

  it('should be unauthenticated by default', function() {
    const { result } = renderAuthenticationHook()

    expect(result.current.isAuthenticated).toBeFalsy()
  })

  it('should authenticate the user', async () => {
    // @ts-ignore
    login.mockResolvedValue()

    const { result, waitForNextUpdate } = renderAuthenticationHook()

    result.current.handleLogin('user', 'password')

    await waitForNextUpdate()

    expect(result.current.isAuthenticated).toBeTruthy()
    expect(login).toHaveBeenCalledWith('user', 'password')
  })

  it('should logout the user', async () => {
    TokenService.removeTokens = jest.fn()

    const { result, history } = renderAuthenticationHook()

    jest.spyOn(history, 'push')

    result.current.handleLogout()

    expect(result.current.isAuthenticated).toBeFalsy()
    expect(clearAllResourcesCache).toHaveBeenCalledWith()
    expect(TokenService.removeTokens).toHaveBeenCalled()
    expect(history.push).toHaveBeenCalledWith('/')
  })
})
