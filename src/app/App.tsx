import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Authentication } from 'core/features/Authentication/Authentication'
import ErrorBoundary from 'react-error-boundary'
import { BrowserRouter } from 'react-router-dom'
import ErrorBoundaryFallback from './ErrorBoundaryFallBack'
import { IOSInstallPWAPrompt } from './IOSInstallPWAPrompt'
import Routes from './Routes'
import { ServiceWorkerUpdateBanner } from './ServiceWorkerUpdateBanner'
import { ChakraProviders } from 'app/ChakraProviders'
import './global.css'

const App: React.FC = () => {
  const { i18n } = useTranslation()

  useEffect(() => {
    // Update html lang attribute
    window.document.documentElement.lang = i18n.language
  }, [i18n.language])

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <ServiceWorkerUpdateBanner />
      <IOSInstallPWAPrompt />
      <React.StrictMode>
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
          <ChakraProviders>
            <Authentication>
              <Routes />
            </Authentication>
          </ChakraProviders>
        </ErrorBoundary>
      </React.StrictMode>
    </BrowserRouter>
  )
}

export default App
