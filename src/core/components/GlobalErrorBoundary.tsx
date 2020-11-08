import React, { Component, ErrorInfo, ReactNode, useCallback } from 'react'
import ky from 'ky'
import { useHistory } from 'react-router-dom'
import { useToast } from '@chakra-ui/core'
import { useTranslation } from 'react-i18next'

interface Props {
  children: ReactNode
  onRefreshTokenExpiration: () => void
}

interface State {
  hasError: boolean
  error?: Error | ky.HTTPError
  redirectToLogin: boolean
}

class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    redirectToLogin: false
  }

  public static getDerivedStateFromError(error: ky.HTTPError): State {
    if (determineIfIsKyError(error)) {
      const refreshTokenExpired = error.response !== undefined && error.response.status === 401

      if (refreshTokenExpired) {
        return { hasError: true, error, redirectToLogin: true }
      }
    }

    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, redirectToLogin: false }
  }

  public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
    if (this.state.redirectToLogin) {
      this.props.onRefreshTokenExpiration()
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    // console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError && !this.state.redirectToLogin) {
      return (
        <div>
          <p>
            <strong>Oops! An error occured!</strong>
          </p>
          <p>Here’s what we know…</p>
          <p>
            <strong>Error:</strong> {this.state.error!.toString()}
          </p>
        </div>
      )
    }

    return this.props.children
  }
}

function determineIfIsKyError(
  toBeDetermined: Error | ky.HTTPError
): toBeDetermined is ky.HTTPError {
  if ((toBeDetermined as ky.HTTPError).response) {
    return true
  }
  return false
}

const GlobalErrorBoundaryContainer: React.FC = (props) => {
  const toast = useToast()
  const history = useHistory()
  const { t } = useTranslation()

  const showExpiredSession = useCallback(() => {
    toast({
      title: t('api_errors.session_expired'),
      description: t('api_errors.session_expired_description'),
      status: 'error',
      duration: 5000,
      isClosable: true,
      position: 'top-right'
    })
    history.push('/')
  }, [toast, history, t])

  return (
    <GlobalErrorBoundary onRefreshTokenExpiration={showExpiredSession}>
      {props.children}
    </GlobalErrorBoundary>
  )
}

export default GlobalErrorBoundaryContainer
