import React, { useEffect } from 'react'
import './App.css'
import './global.css'
import './css-variables.css'
import { useTranslation } from 'react-i18next'
import { VacationPage } from 'pages/vacation/VacationPage'
import { AppProviders } from 'app/AppProviders'
import { Button, useColorMode } from '@chakra-ui/core'

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
      <VacationPage />
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
