import type { FC } from 'react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { AppProviders } from 'shared/AppProviders'
import { AppRoutes } from 'shared/AppRoutes'
import { IOSInstallPWAPrompt } from 'shared/components/IOSInstallPWAPrompt'

const App: FC = () => {
  const { i18n } = useTranslation()

  useEffect(() => {
    // Update html lang attribute
    window.document.documentElement.lang = i18n.language
  }, [i18n.language])

  return (
    <AppProviders>
      <IOSInstallPWAPrompt />
      <AppRoutes />
    </AppProviders>
  )
}

export default App
