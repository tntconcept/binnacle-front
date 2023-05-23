import type { FC } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { GlobalErrorBoundary } from 'shared/components/GlobalErrorBoundary'
import { TntChakraProvider } from 'shared/providers/tnt-chakra-provider'
import { AuthProvider } from './shared/contexts/auth-context'

export const AppProviders: FC = (props) => {
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
