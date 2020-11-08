import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as serviceWorkerRegistration from '../../serviceWorkerRegistration'
import 'core/components/ServiceWorkerUpdateBanner.css'

export function ServiceWorkerUpdateBanner() {
  const { t } = useTranslation()
  const [showReload, setShowReload] = useState(false)
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)

  const onSWUpdate = (registration: ServiceWorkerRegistration) => {
    setShowReload(true)
    setWaitingWorker(registration.waiting)
  }

  useEffect(() => {
    // Enables service worker
    serviceWorkerRegistration.register({ onUpdate: onSWUpdate })
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
