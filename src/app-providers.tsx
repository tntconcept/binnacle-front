import type { FC } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { GlobalErrorBoundary } from './shared/components/global-error-boundary'
import { TntChakraProvider } from './shared/providers/tnt-chakra-provider'
import { AuthProvider } from './shared/contexts/auth-context'
import { PropsWithChildren } from 'react'

export const AppProviders: FC<PropsWithChildren> = (props) => {
  return (
    <BrowserRouter basename={'tnt'}>
      <AuthProvider>
        <TntChakraProvider>
          <GlobalErrorBoundary>{props.children}</GlobalErrorBoundary>
        </TntChakraProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
