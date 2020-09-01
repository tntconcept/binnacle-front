import React, { useEffect } from 'react'
import './App.css'
import './global.css'
import './css-variables.css'
import { useTranslation } from 'react-i18next'
import { AppProviders } from 'app/AppProviders'
import { SettingsContextProvider } from 'core/components/SettingsContext'
import { Authentication } from 'core/features/Authentication/Authentication'
import { Notifications } from 'core/features/Notifications/Notifications'
import ErrorBoundary from 'react-error-boundary'
import { BrowserRouter } from 'react-router-dom'
import ErrorBoundaryFallback from './ErrorBoundaryFallBack'
import { IOSInstallPWAPrompt } from './IOSInstallPWAPrompt'
import Routes from './Routes'
import { ServiceWorkerUpdateBanner } from './ServiceWorkerUpdateBanner'

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
          <SettingsContextProvider>
            <Notifications>
              <Authentication>
                <Routes />
              </Authentication>
            </Notifications>
          </SettingsContextProvider>
        </ErrorBoundary>
      </React.StrictMode>
    </BrowserRouter>
  )
}

export default App
