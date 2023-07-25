import type { FC } from 'react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { AppProviders } from './app-providers'
import { AppRoutes } from './app-routes'
import { IosInstallPwaPrompt } from './shared/components/ios-install-pwa-prompt'
import { ServiceWorkerPrompt } from './shared/components/service-worker-prompt/service-worker-prompt'
import { ToastContainer } from './shared/notification/toast'

export const App: FC = () => {
  const { i18n } = useTranslation()

  useEffect(() => {
    // Update html lang attribute
    window.document.documentElement.lang = i18n.language
  }, [i18n.language])

  return (
    <AppProviders>
      <IosInstallPwaPrompt />
      <ServiceWorkerPrompt />
      <AppRoutes />
      <ToastContainer />
    </AppProviders>
  )
}
