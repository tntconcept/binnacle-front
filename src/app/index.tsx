import React, { useEffect, useState } from 'react'
import './App.css'
import './global.css'
import './css-variables.css'
import { Notifications } from 'features/Notifications'
import { Authentication } from 'features/Authentication'
import Routes from './Routes'
import { SettingsProvider } from 'features/SettingsContext/SettingsContext'
import ErrorBoundary from 'react-error-boundary'
import ErrorBoundaryFallback from 'app/ErrorBoundaryFallBack'
import PWAPrompt from 'react-ios-pwa-prompt'
import { useTranslation } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import i18n from 'i18n'
import * as serviceWorker from 'serviceWorker'

const App: React.FC = () => {
  useEffect(() => {
    // Update html lang attribute
    window.document.documentElement.lang = i18n.language
  }, [])

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <ServiceWorkerUpdateBanner />
      <IOSInstallPWAPrompt />
      <React.StrictMode>
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
          <SettingsProvider>
            <Notifications>
              <Authentication>
                <Routes />
              </Authentication>
            </Notifications>
          </SettingsProvider>
        </ErrorBoundary>
      </React.StrictMode>
    </BrowserRouter>
  )
}

const isHttps = window.location.protocol === 'https:'
const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(
  navigator.userAgent
)

const IOSInstallPWAPrompt = () => {
  const { t } = useTranslation()

  const canShowIOSPrompt = isHttps && isSafari

  return canShowIOSPrompt ? (
    <PWAPrompt
      timesToShow={3}
      permanentlyHideOnDismiss={false}
      copyTitle={t('ios_install_pwa.title')}
      copyBody={t('ios_install_pwa.body')}
      copyShareButtonLabel={t('ios_install_pwa.share_button')}
      copyAddHomeButtonLabel={t('ios_install_pwa.add_home_button')}
      copyClosePrompt={t('close')}
      debug={false}
    />
  ) : null
}

function ServiceWorkerUpdateBanner() {
  const { t } = useTranslation()
  const [showReload, setShowReload] = useState(false)
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)

  const onSWUpdate = (registration: ServiceWorkerRegistration) => {
    setShowReload(true)
    setWaitingWorker(registration.waiting)
  }

  useEffect(() => {
    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: https://bit.ly/CRA-PWA
    serviceWorker.register({ onUpdate: onSWUpdate })
  }, [])

  const reloadPage = () => {
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' })
    setShowReload(false)
    window.location.reload()
  }

  return showReload ? (
    <div className="update-banner">
      <p className="update-text">{t('pwa_update.message')}</p>
      <button
        className="update-button"
        onClick={reloadPage}>
        {t('pwa_update.action')}
      </button>
    </div>
  ) : null
}

export default App
