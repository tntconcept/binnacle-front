import type { FC } from 'react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { AppProviders } from './app-providers'
import { AppRoutes } from './app-routes'
import { ToastContainer } from './shared/notification/toast'

export const App: FC = () => {
  const { i18n } = useTranslation()

  useEffect(() => {
    window.document.documentElement.lang = i18n.language
  }, [i18n.language])

  return (
    <AppProviders>
      <AppRoutes />
      <ToastContainer />
    </AppProviders>
  )
}
