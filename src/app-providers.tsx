import type { FC } from 'react'
import { GlobalErrorBoundary } from 'shared/components/GlobalErrorBoundary'
import { MyChakraProvider } from 'shared/providers/MyChakraProvider'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './shared/contexts/auth-context'

export const AppProviders: FC = (props) => {
  return (
    <BrowserRouter basename={'tnt'}>
      <AuthProvider>
        <MyChakraProvider>
          <GlobalErrorBoundary>{props.children}</GlobalErrorBoundary>
        </MyChakraProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
