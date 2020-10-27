import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ServiceWorkerUpdateBanner } from 'core/components/ServiceWorkerUpdateBanner'
import { IOSInstallPWAPrompt } from 'core/components/IOSInstallPWAPrompt'
import { AppRoutes } from 'core/AppRoutes'
import { AppProviders } from 'core/AppProviders'
import 'focus-visible/dist/focus-visible'
import './global.css'

const App: React.FC = () => {
  const { i18n } = useTranslation()

  useEffect(() => {
    // Update html lang attribute
    window.document.documentElement.lang = i18n.language
  }, [i18n.language])

  return (
    <AppProviders>
      <ServiceWorkerUpdateBanner />
      <IOSInstallPWAPrompt />
      <AppRoutes />
    </AppProviders>
  )
}

export default App
