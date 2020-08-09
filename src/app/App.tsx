import React, { useEffect } from 'react'
import './App.css'
import './global.css'
import './css-variables.css'
import { Notifications } from 'core/features/Notifications/Notifications'
import { Authentication } from 'core/features/Authentication/Authentication'
import Routes from './Routes'
import ErrorBoundary from 'react-error-boundary'
import ErrorBoundaryFallback from 'app/ErrorBoundaryFallBack'
import { useTranslation } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { SettingsContextProvider } from 'core/components/SettingsContext'
import { IOSInstallPWAPrompt } from 'app/IOSInstallPWAPrompt'
import { ServiceWorkerUpdateBanner } from 'app/ServiceWorkerUpdateBanner'
import { Vacations } from 'pages/vacations/Vacations'
import { AppProviders } from 'app/AppProviders'
import { useColorMode, Button } from '@chakra-ui/core'

const App: React.FC = () => {
  const { i18n } = useTranslation()

  useEffect(() => {
    // Update html lang attribute
    window.document.documentElement.lang = i18n.language
  }, [i18n.language])

  // return (
  //   <BrowserRouter basename={process.env.PUBLIC_URL}>
  //     <ServiceWorkerUpdateBanner />
  //     <IOSInstallPWAPrompt />
  //     <React.StrictMode>
  //       <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
  //         <SettingsContextProvider>
  //           <Notifications>
  //             <Authentication>
  //               <Routes />
  //             </Authentication>
  //           </Notifications>
  //         </SettingsContextProvider>
  //       </ErrorBoundary>
  //     </React.StrictMode>
  //   </BrowserRouter>
  // )
  return (
    <AppProviders>
      <Example />
      <Vacations />
    </AppProviders>
  )
}

export default App

function Example() {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <header>
      <Button onClick={toggleColorMode}>
        Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
      </Button>
    </header>
  )
}
