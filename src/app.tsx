import type { FC } from 'react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { AppProviders } from 'app-providers'
import { AppRoutes } from 'app-routes'
import { IOSInstallPWAPrompt } from 'shared/components/IOSInstallPWAPrompt'

import { ServiceWorkerPrompt } from 'shared/components/ServiceWorkerPrompt/ServiceWorkerPrompt'

export const App: FC = () => {
  const { i18n } = useTranslation()

  useEffect(() => {
    // Update html lang attribute
    window.document.documentElement.lang = i18n.language
  }, [i18n.language])

  return (
    <AppProviders>
      <IOSInstallPWAPrompt />
      <ServiceWorkerPrompt />
      <AppRoutes />
    </AppProviders>
  )
}
