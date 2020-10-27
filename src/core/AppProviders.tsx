import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import GlobalErrorBoundary from 'core/components/GlobalErrorBoundary'
import { MyChakraProvider } from 'core/providers/MyChakraProvider'
import { AuthenticationProvider } from 'core/providers/AuthenticationProvider'
// Enable i18n using the custom configuration
import 'core/i18n/i18n'

export const AppProviders: React.FC = (props) => {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <GlobalErrorBoundary>
        <MyChakraProvider>
          <AuthenticationProvider>{props.children}</AuthenticationProvider>
        </MyChakraProvider>
      </GlobalErrorBoundary>
    </Router>
  )
}
