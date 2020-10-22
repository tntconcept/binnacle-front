import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as serviceWorker from 'serviceWorker'
import './ServiceWorkerUpdateBanner.css'

export function ServiceWorkerUpdateBanner() {
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
      <button className="update-button" onClick={reloadPage}>
        {t('pwa_update.action')}
      </button>
    </div>
  ) : null
}
